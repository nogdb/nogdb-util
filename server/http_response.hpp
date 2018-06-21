
#include <nogdb/nogdb.h>
#include <server_http.hpp>

namespace nogdb {
    namespace server {
        using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;
        using HttpResponsePtr = std::shared_ptr<HttpServer::Response>;
        using HttpRequestPtr = std::shared_ptr<HttpServer::Request>;

        void setupHttpResponse(HttpServer &sv, Context &ctx);

        void responseSQLExecute(Context &ctx, HttpResponsePtr response, HttpRequestPtr request);
    }
}

