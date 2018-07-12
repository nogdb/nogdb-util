
#include <functional>
#include <nogdb/nogdb.h>
#include <nlohmann/json.hpp>
#include <server_http.hpp>

#include "../src/translator.hpp"

#include "http_response.hpp"

using namespace std;
using namespace nogdb;
using nlohmann::json;

using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;
using HttpResponsePtr = std::shared_ptr<HttpServer::Response>;
using HttpRequestPtr = std::shared_ptr<HttpServer::Request>;
using ResponseFunction = function<string(Txn&, const json&)>;

static void responseHandler(ResponseFunction func, Txn::Mode txnMode, server::Context &ctx, HttpResponsePtr res, HttpRequestPtr req) {
    try {
        auto content = json::parse(req->content.string());
        if (content.find("txnID") != content.end()) {
            try {
                auto &txn = ctx.getTxn(content["txnID"].get<TxnId>());
                auto result = func(txn, content);
                res->write(result);
            } catch (const std::out_of_range) {
                res->write(SimpleWeb::StatusCode::server_error_internal_server_error, json{{"error", "Invalid Transaction ID"}}.dump());
            }
        } else {
            auto txn = Txn(ctx, txnMode);
            auto result = func(txn, content);
            txn.commit();
            res->write(result);
        }
    }
    catch (const nogdb::Error &e) {
        res->write(SimpleWeb::StatusCode::server_error_internal_server_error, json{{"error", e.what()}}.dump());
    }
    catch (const exception &e) {
        res->write(SimpleWeb::StatusCode::client_error_bad_request, json{{"error", e.what()}}.dump());
    }
}

void nogdb::server::setupHttpResponse(HttpServer &sv, Context &ctx) {
    sv.resource["^/Txn/(create|commit|rollback)$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        try {
            auto content = json::parse(req->content);

            if (req->path_match[1] == "create") {
                auto mode = content.at("mode").get<Txn::Mode>();
                auto txnID = ctx.setTxn(Txn(ctx, mode));
                res->write(json{{"txnID", txnID}}.dump());
            } else {
                auto txnID = content.at("txnID").get<TxnId>();
                if (req->path_match[1] == "commit") {
                    ctx.commitTxn(txnID);
                } else /* if (req->path_match[1] == "rollback" */ {
                    ctx.rollbackTxn(txnID);
                }
                res->write(json::object().dump());
            }
        } catch (const nogdb::Error &e) {
            res->write(SimpleWeb::StatusCode::server_error_internal_server_error, json{{"error", e.what()}}.dump());
        }
        catch (const exception &e) {
            res->write(SimpleWeb::StatusCode::client_error_bad_request, json{{"error", e.what()}}.dump());
        }
    };

    sv.resource["^/Class/create$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseClassCreate, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Class/createExtend$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseClassCreateExtend, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Class/drop$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseClassDrop, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Class/alter$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseClassAlter, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Property/add$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responsePropertyAdd, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Property/alter$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responsePropertyAlter, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Property/remove$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responsePropertyRemove, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Property/createIndex$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responsePropertyCreateIndex, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Property/dropIndex$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responsePropertyDropIndex, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Vertex/create$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseVertexCreate, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Vertex/update$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseVertexUpdate, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Vertex/destroy$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseVertexDestroy, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Vertex/get$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseVertexGet, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Vertex/getInEdge$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseVertexGetInEdge, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Vertex/getOutEdge$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseVertexGetOutEdge, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Vertex/getAllEdge$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseVertexGetAllEdge, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Edge/create$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeCreate, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Edge/update$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeUpdate, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Edge/updateSrc$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeUpdateSrc, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Edge/updateDst$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeUpdateDst, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Edge/destroy$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeDestroy, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/Edge/get$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeGet, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Edge/getSrc$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeGetSrc, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Edge/getDst$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeGetDst, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Edge/getSrcDst$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseEdgeGetSrcDst, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Db/getRecord$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseDbGetRecord, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Db/getSchema$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseDbGetSchema, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Db/getDbInfo"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseDbGetDbInfo, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Traverse/inEdgeBfs"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseTraverseInEdgeBfs, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Traverse/outEdgeBfs"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseTraverseOutEdgeBfs, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Traverse/allEdgeBfs"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseTraverseAllEdgeBfs, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Traverse/inEdgeDfs"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseTraverseInEdgeDfs, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Traverse/outEdgeDfs"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseTraverseOutEdgeDfs, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Traverse/allEdgeDfs"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseTraverseAllEdgeDfs, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/Traverse/shortestPath"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseTraverseShortestPath, Txn::Mode::READ_ONLY, ctx, res, req);
    };

    sv.resource["^/SQL/execute$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseSQLExecute, Txn::Mode::READ_WRITE, ctx, res, req);
    };
}


string nogdb::server::responseClassCreate(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto type = content.at("type").get<ClassType>();
    auto result = Class::create(txn, className, type);
    return json(result).dump();
}

string nogdb::server::responseClassCreateExtend(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto superClass = content.at("superClass").get_ref<const string&>();
    auto result = Class::createExtend(txn, className, superClass);
    return json(result).dump();
}

string nogdb::server::responseClassDrop(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    Class::drop(txn, className);
    return json::object().dump();
}

string nogdb::server::responseClassAlter(Txn &txn, const json &content) {
    auto oldClassName = content.at("oldClassName").get_ref<const string&>();
    auto newClassName = content.at("newClassName").get_ref<const string&>();
    Class::alter(txn, oldClassName, newClassName);
    return json::object().dump();
}

string nogdb::server::responsePropertyAdd(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto propertyName = content.at("propertyName").get_ref<const string&>();
    auto type = content.at("type").get<PropertyType>();
    auto result = Property::add(txn, className, propertyName, type);
    return json(result).dump();
}

string nogdb::server::responsePropertyAlter(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto oldPropertyName = content.at("oldPropertyName").get_ref<const string&>();
    auto newPropertyName = content.at("newPropertyName").get_ref<const string&>();
    Property::alter(txn, className, oldPropertyName, newPropertyName);
    return json::object().dump();
}

string nogdb::server::responsePropertyRemove(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto propertyName = content.at("propertyName").get_ref<const string&>();
    Property::remove(txn, className, propertyName);
    return json::object().dump();
}

string nogdb::server::responsePropertyCreateIndex(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto propertyName = content.at("propertyName").get_ref<const string&>();
    auto isUnique = content.at("isUnique").get<bool>();
    Property::createIndex(txn, className, propertyName, isUnique);
    return json::object().dump();
}

string nogdb::server::responsePropertyDropIndex(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto propertyName = content.at("propertyName").get_ref<const string&>();
    Property::dropIndex(txn, className, propertyName);
    return json::object().dump();
}

string nogdb::server::responseVertexCreate(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto record = content.at("record").get<Record>();
    auto result = Vertex::create(txn, className, record);
    return json(result).dump();
}

string nogdb::server::responseVertexUpdate(Txn &txn, const json &content) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto record = content.at("record").get<Record>();
    Vertex::update(txn, recordDescriptor, record);
    return json::object().dump();
}

string nogdb::server::responseVertexDestroy(Txn &txn, const json &content) {
    json::const_iterator it;
    if ((it = content.find("recordDescriptor")) != content.end()) {
        auto recordDescriptor = it->get<RecordDescriptor>();
        Vertex::destroy(txn, recordDescriptor);
    } else {
        auto className = content.at("className").get_ref<const string&>();
        Vertex::destroy(txn, className);
    }
    return json::object().dump();
}

string nogdb::server::responseVertexGet(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto result = Vertex::get(txn, className);

    auto schema = Db::getSchema(txn, className);
    auto jResult = json::array();
    for (const auto &r: result) {
        json jR;
        to_json(jR, r, schema);
        jResult.push_back(move(jR));
    }
    return jResult.dump();
}

static string responseVertexGetAnyEdge(Txn &txn, const json &content, ResultSet (*funcGetEdge)(const Txn&, const RecordDescriptor&, const ClassFilter&)) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto classFilter = ClassFilter();

    json::const_iterator it;
    if ((it = content.find("classFilter")) != content.end()) {
        classFilter = it->get<ClassFilter>();
    }
    auto result = funcGetEdge(txn, recordDescriptor, classFilter);
    auto jResult = json::array();
    auto schema = result.empty() ? ClassDescriptor() : Db::getSchema(txn, result.front().descriptor.rid.first);
    for (const auto &r: result) {
        json jR;
        if (schema.id != r.descriptor.rid.first) {
            schema = Db::getSchema(txn, r.descriptor.rid.first);
        }
        to_json(jR, r, schema);
        jResult.push_back(move(jR));
    }
    return jResult.dump();
}

string nogdb::server::responseVertexGetInEdge(Txn &txn, const json &content) {
    return responseVertexGetAnyEdge(txn, content, Vertex::getInEdge);
}

string nogdb::server::responseVertexGetOutEdge(Txn &txn, const json &content) {
    return responseVertexGetAnyEdge(txn, content, Vertex::getOutEdge);
}

string nogdb::server::responseVertexGetAllEdge(Txn &txn, const json &content) {
    return responseVertexGetAnyEdge(txn, content, Vertex::getAllEdge);
}

string nogdb::server::responseEdgeCreate(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto srcVertexRecordDescriptor = content.at("srcVertexRecordDescriptor").get<RecordDescriptor>();
    auto dstVertexRecordDescriptor = content.at("dstVertexRecordDescriptor").get<RecordDescriptor>();
    auto record = content.at("record").get<Record>();
    auto result = Edge::create(txn, className, srcVertexRecordDescriptor, dstVertexRecordDescriptor, record);
    return json(result).dump();
}

string nogdb::server::responseEdgeUpdate(Txn &txn, const json &content) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto record = content.at("record").get<Record>();
    Edge::update(txn, recordDescriptor, record);
    return json::object().dump();
}

string nogdb::server::responseEdgeUpdateSrc(Txn &txn, const json &content) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto newSrcVertexRecordDescriptor = content.at("newSrcVertexRecordDescriptor").get<RecordDescriptor>();
    Edge::updateSrc(txn, recordDescriptor, newSrcVertexRecordDescriptor);
    return json::object().dump();
}

string nogdb::server::responseEdgeUpdateDst(Txn &txn, const json &content) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto newDstVertexRecordDescriptor = content.at("newDstVertexRecordDescriptor").get<RecordDescriptor>();
    Edge::updateDst(txn, recordDescriptor, newDstVertexRecordDescriptor);
    return json::object().dump();
}

string nogdb::server::responseEdgeDestroy(Txn &txn, const json &content) {
    json::const_iterator it;
    if ((it = content.find("recordDescriptor")) != content.end()) {
        auto recordDescriptor = it->get<RecordDescriptor>();
        Edge::destroy(txn, recordDescriptor);
    } else {
        auto className = content.at("className").get_ref<const string&>();
        Edge::destroy(txn, className);
    }
    return json::object().dump();
}

string nogdb::server::responseEdgeGet(Txn &txn, const json &content) {
    auto className = content.at("className").get_ref<const string&>();
    auto result = Edge::get(txn, className);

    auto schema = Db::getSchema(txn, className);
    auto jResult = json::array();
    for (const auto &r: result) {
        json jR;
        to_json(jR, r, schema);
        jResult.push_back(move(jR));
    }
    return jResult.dump();
}

string nogdb::server::responseEdgeGetSrc(Txn &txn, const json &content) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto result = Edge::getSrc(txn, recordDescriptor);
    auto jR = json();
    to_json(jR, result, Db::getSchema(txn, result.descriptor.rid.first));
    return jR.dump();
}

string nogdb::server::responseEdgeGetDst(Txn &txn, const json &content) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto result = Edge::getDst(txn, recordDescriptor);
    auto jR = json();
    to_json(jR, result, Db::getSchema(txn, result.descriptor.rid.first));
    return jR.dump();
}

string nogdb::server::responseEdgeGetSrcDst(Txn &txn, const json &content) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto result = Edge::getSrcDst(txn, recordDescriptor);
    auto jResult = json::array();
    auto schema = result.empty() ? ClassDescriptor() : Db::getSchema(txn, result.front().descriptor.rid.first);
    for (const auto &r: result) {
        json jR;
        if (schema.id != r.descriptor.rid.first) {
            schema = Db::getSchema(txn, r.descriptor.rid.first);
        }
        to_json(jR, r, schema);
        jResult.push_back(move(jR));
    }
    return jResult.dump();
}

string nogdb::server::responseDbGetRecord(Txn &txn, const json &content) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto result = Db::getRecord(txn, recordDescriptor);
    auto jR = json();
    to_json(jR, result, Db::getSchema(txn, recordDescriptor.rid.first));
    return jR.dump();
}

string nogdb::server::responseDbGetSchema(Txn &txn, const json &content) {
    json::const_iterator it;
    if (content.empty()) {
        auto result = Db::getSchema(txn);
        return json(result).dump();
    } else {
        if ((it = content.find("className")) != content.end()) {
            auto className = it->get_ref<const string&>();
            auto result = Db::getSchema(txn, className);
            return json(result).dump();
        }
        else /* if ((it = content.find("classId")) != content.end()) */ {
            auto classId = content.at("classId").get<ClassId>();
            auto result = Db::getSchema(txn, classId);
            return json(result).dump();
        }
    }
}

string nogdb::server::responseDbGetDbInfo(Txn &txn, const json &content) {
    auto result = Db::getDbInfo(txn);
    json jResult = json(result);
    return json(result).dump();
}

static string responseTraverseAny(Txn &txn, const json &content, ResultSet (*funcTraverse)(const Txn &, const RecordDescriptor&, unsigned int, unsigned int, const ClassFilter&)) {
    auto recordDescriptor = content.at("recordDescriptor").get<RecordDescriptor>();
    auto minDepth = content.at("minDepth").get<unsigned int>();
    auto maxDepth = content.at("maxDepth").get<unsigned int>();
    auto classFilter = ClassFilter{};
    json::const_iterator it;
    if ((it = content.find("classFilter")) != content.end()) {
        classFilter = it->get<ClassFilter>();
    }

    auto result = funcTraverse(txn, recordDescriptor, minDepth, maxDepth, classFilter);
    auto jResult = json::array();
    auto schema = result.empty() ? ClassDescriptor() : Db::getSchema(txn, result.front().descriptor.rid.first);
    for (const auto &r: result) {
        json jR;
        if (schema.id != r.descriptor.rid.first) {
            schema = Db::getSchema(txn, r.descriptor.rid.first);
        }
        to_json(jR, r, schema);
        jResult.push_back(move(jR));
    }
    return jResult.dump();
}

string nogdb::server::responseTraverseInEdgeBfs(Txn &txn, const json &content) {
    return responseTraverseAny(txn, content, Traverse::inEdgeBfs);
}

string nogdb::server::responseTraverseOutEdgeBfs(Txn &txn, const json &content) {
    return responseTraverseAny(txn, content, Traverse::outEdgeBfs);
}

string nogdb::server::responseTraverseAllEdgeBfs(Txn &txn, const json &content) {
    return responseTraverseAny(txn, content, Traverse::allEdgeBfs);
}

string nogdb::server::responseTraverseInEdgeDfs(Txn &txn, const json &content) {
    return responseTraverseAny(txn, content, Traverse::inEdgeDfs);
}

string nogdb::server::responseTraverseOutEdgeDfs(Txn &txn, const json &content) {
    return responseTraverseAny(txn, content, Traverse::outEdgeDfs);
}

string nogdb::server::responseTraverseAllEdgeDfs(Txn &txn, const json &content) {
    return responseTraverseAny(txn, content, Traverse::allEdgeDfs);
}

string nogdb::server::responseTraverseShortestPath(Txn &txn, const json &content) {
    auto srcVertexRecordDescriptor = content.at("srcVertexRecordDescriptor").get<RecordDescriptor>();
    auto dstVertexRecordDescriptor = content.at("dstVertexRecordDescriptor").get<RecordDescriptor>();
    auto classFilter = ClassFilter{};
    json::const_iterator it;
    if ((it = content.find("classFilter")) != content.end()) {
        classFilter = it->get<ClassFilter>();
    }
    auto result = Traverse::shortestPath(txn, srcVertexRecordDescriptor, dstVertexRecordDescriptor, classFilter);
    auto jResult = json::array();
    auto schema = result.empty() ? ClassDescriptor() : Db::getSchema(txn, result.front().descriptor.rid.first);
    for (const auto &r: result) {
        json jR;
        if (schema.id != r.descriptor.rid.first) {
            schema = Db::getSchema(txn, r.descriptor.rid.first);
        }
        to_json(jR, r, schema);
        jResult.push_back(move(jR));
    }
    return jResult.dump();
}

string nogdb::server::responseSQLExecute(Txn &txn, const json &content) {
        auto sql = content.at("sql").get_ref<const string&>();
        auto result = SQL::execute(txn, sql);

        json jResult;
        if (result.type() == SQL::Result::Type::RESULT_SET) {
            to_json(jResult, result, Db::getSchema(txn));
        } else {
            to_json(jResult, result);
        }
        return jResult.dump();
}
