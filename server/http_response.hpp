
#include <nogdb/nogdb.h>
#include <server_http.hpp>

namespace nogdb {
    using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;

    void setupHttpResponse(HttpServer &sv, Context &ctx);
}

