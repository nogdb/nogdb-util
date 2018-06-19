
#include <nogdb/nogdb.h>
#include <nlohmann/json.hpp>
#include <server_http.hpp>

#include "../src/translator.hpp"

#include "http_response.hpp"

using namespace std;
using namespace nogdb;
using nlohmann::json;

using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;

void nogdb::setupHttpResponse(HttpServer &sv, Context &ctx) {

    sv.resource["^/sql/execute$"]["POST"] = [&ctx](shared_ptr<HttpServer::Response> response, shared_ptr<HttpServer::Request> request) {
        try {
            auto content = json::parse(request->content);
            auto txn = Txn(ctx, Txn::Mode::READ_WRITE);
            auto sql = content.at("sql").get_ref<const string&>();
            auto result = SQL::execute(txn, sql);

            json jResult;
            if (result.type() == SQL::Result::Type::RESULT_SET) {
                to_json(jResult, result, Db::getSchema(txn));
            } else {
                to_json(jResult, result);
            }
            response->write(jResult.dump());
        }
        catch (const nogdb::Error &e) {

        }
        catch (const exception &e) {
            response->write(SimpleWeb::StatusCode::client_error_bad_request, e.what());
        }
    };
}

