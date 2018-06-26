
#include <nogdb/nogdb.h>
#include <server_http.hpp>
#include <nlohmann/json.hpp>

#include "context.hpp"

namespace nogdb {
    namespace server {
        using namespace std;
        using nlohmann::json;
        using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;
        using HttpResponsePtr = std::shared_ptr<HttpServer::Response>;
        using HttpRequestPtr = std::shared_ptr<HttpServer::Request>;

        void setupHttpResponse(HttpServer &sv, Context &ctx);

        string responseDbGetDbInfo(Txn &txn, const json &content);

        string responseSQLExecute(Txn &txn, const json &content);
    }
}

