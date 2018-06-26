
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
        auto content = json::parse(req->content);
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

    sv.resource["^/Db/getDbInfo"]["GET"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseDbGetDbInfo, Txn::Mode::READ_WRITE, ctx, res, req);
    };

    sv.resource["^/SQL/execute$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> res, shared_ptr<HttpServer::Request> req) {
        ::responseHandler(responseSQLExecute, Txn::Mode::READ_WRITE, ctx, res, req);
    };
}



string nogdb::server::responseDbGetDbInfo(Txn &txn, const json &content) {
    auto result = Db::getDbInfo(txn);
    json jResult = json(result);
    return json(result).dump();
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
