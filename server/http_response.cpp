
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
        if (content.find("txn") != content.end()) {
            try {
                auto &txn = ctx.getTxn(content["txn"].get<TxnId>());
                auto result = func(txn, content);
            } catch (const std::out_of_range) {
                res->write(SimpleWeb::StatusCode::server_error_internal_server_error, "Invalid Transaction ID");
            }
        } else {
            auto txn = Txn(ctx, txnMode);
            auto result = func(txn, content);
            txn.commit();
            res->write(result);
        }
    }
    catch (const nogdb::Error &e) {
        res->write(SimpleWeb::StatusCode::server_error_internal_server_error, e.what());
    }
    catch (const exception &e) {
        res->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
    }
}

void nogdb::server::setupHttpResponse(HttpServer &sv, Context &ctx) {

    sv.resource["^/Db/getDbInfo"]["GET"] = [&ctx](shared_ptr<HttpServer::Response> response, shared_ptr<HttpServer::Request> request) {
        ::responseHandler(responseDbGetDbInfo, Txn::Mode::READ_WRITE, ctx, response, request);
    };

    sv.resource["^/SQL/execute$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> response, shared_ptr<HttpServer::Request> request) {
        ::responseHandler(responseSQLExecute, Txn::Mode::READ_WRITE, ctx, response, request);
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
