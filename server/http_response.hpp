#ifndef __NOGDB_UTIL_SERVER_HTTP_RESPONSE_HPP_INCLUDED__
#define __NOGDB_UTIL_SERVER_HTTP_RESPONSE_HPP_INCLUDED__

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

        string responseClassCreate(Txn &txn, const json &content);
        string responseClassCreateExtend(Txn &txn, const json &content);
        string responseClassDrop(Txn &txn, const json &content);
        string responseClassAlter(Txn &txn, const json &content);

        string responsePropertyAdd(Txn &txn, const json &content);
        string responsePropertyAlter(Txn &txn, const json &content);
        string responsePropertyRemove(Txn &txn, const json &content);
        string responsePropertyCreateIndex(Txn &txn, const json &content);
        string responsePropertyDropIndex(Txn &txn, const json &content);

        string responseVertexCreate(Txn &txn, const json &content);
        string responseVertexUpdate(Txn &txn, const json &content);
        string responseVertexDestroy(Txn &txn, const json &content);
        string responseVertexGet(Txn &txn, const json &content);
        string responseVertexGetInEdge(Txn &txn, const json &content);
        string responseVertexGetOutEdge(Txn &txn, const json &content);
        string responseVertexGetAllEdge(Txn &txn, const json &content);

        string responseEdgeCreate(Txn &txn, const json &content);
        string responseEdgeUpdate(Txn &txn, const json &content);
        string responseEdgeUpdateSrc(Txn &txn, const json &content);
        string responseEdgeUpdateDst(Txn &txn, const json &content);
        string responseEdgeDestroy(Txn &txn, const json &content);
        string responseEdgeGet(Txn &txn, const json &content);
        string responseEdgeGetSrc(Txn &txn, const json &content);
        string responseEdgeGetDst(Txn &txn, const json &content);
        string responseEdgeGetSrcDst(Txn &txn, const json &content);

        string responseDbGetRecord(Txn &txn, const json &content);
        string responseDbGetSchema(Txn &txn, const json &content);
        string responseDbGetDbInfo(Txn &txn, const json &content);

        string responseTraverseInEdgeBfs(Txn &txn, const json &content);
        string responseTraverseOutEdgeBfs(Txn &txn, const json &content);
        string responseTraverseAllEdgeBfs(Txn &txn, const json &content);
        string responseTraverseInEdgeDfs(Txn &txn, const json &content);
        string responseTraverseOutEdgeDfs(Txn &txn, const json &content);
        string responseTraverseAllEdgeDfs(Txn &txn, const json &content);
        string responseTraverseShortestPath(Txn &txn, const json &content);

        string responseSQLExecute(Txn &txn, const json &content);
    }
}

#endif

