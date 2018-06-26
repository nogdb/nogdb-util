/*
 *  Copyright (C) 2018, Throughwave (Thailand) Co., Ltd.
 *
 *  This file is part of nogdb-util, the NogDB Utility in C++.
 *
 *  nogdb-util is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

#include <gtest/gtest.h>
#include <nogdb/nogdb.h>
#include <server_http.hpp>
#include <client_http.hpp>

#include "../src/translator.hpp"
#include "../server/http_response.hpp"

using namespace std;
using namespace nogdb;

using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;
using HttpClient = SimpleWeb::Client<SimpleWeb::HTTP>;

#define TEST_DBPART "test.db"
static const unsigned short TEST_PORT = 8090;

class ServerHttpResponseTest : public testing::Test {
protected:
    virtual void SetUp() {
        ctx = server::Context(TEST_DBPART);
        server.config.port = TEST_PORT;
        server::setupHttpResponse(server, ctx);
        svThread = thread([&]() { server.start(); });
        this_thread::sleep_for(chrono::milliseconds(5));
    }
     virtual void TearDown() {
         server.stop();
         svThread.join();
         ctx = server::Context{}; // unlock test.db
         system("rm -r " TEST_DBPART);
     }

    server::Context ctx;
    HttpServer server;
    thread svThread;
};

TEST_F(ServerHttpResponseTest, ResponseDbGetDbInfo) {
    auto txn = Txn(this->ctx, Txn::Mode::READ_ONLY);
    auto result = json::parse(server::responseDbGetDbInfo(txn, {}));
    EXPECT_EQ(result["dbPath"], TEST_DBPART);
    EXPECT_EQ(result["maxDB"], 1024);
    EXPECT_EQ(result["maxDBSize"], 1073741824);
}

TEST_F(ServerHttpResponseTest, ResponseSQLExecute) {
    auto txn = Txn(this->ctx, Txn::Mode::READ_WRITE);

    auto jSQL = json{{"sql", "CREATE CLASS 'V' IF NOT EXISTS EXTENDS VERTEX"}};
    auto result = json::parse(server::responseSQLExecute(txn, jSQL));
    EXPECT_EQ(result["type"], SQL::Result::Type::CLASS_DESCRIPTOR);
    EXPECT_EQ(result["data"]["name"], "V");

    jSQL = json{{"sql", "CREATE PROPERTY V.p1 TEXT"}};
    result = json::parse(server::responseSQLExecute(txn, jSQL));
    EXPECT_EQ(result["type"], SQL::Result::Type::PROPERTY_DESCRIPTOR);
    EXPECT_EQ(result["data"]["type"], PropertyType::TEXT);

    jSQL = json{{"sql", "CREATE VERTEX V SET p1='v1'"}};
    result = json::parse(server::responseSQLExecute(txn, jSQL));
    EXPECT_EQ(result["type"], SQL::Result::Type::RECORD_DESCRIPTORS);

    jSQL = json{{"sql", "SELECT * FROM V"}};
    result = json::parse(server::responseSQLExecute(txn, jSQL));
    EXPECT_EQ(result["type"], SQL::Result::Type::RESULT_SET);
    EXPECT_EQ(result["data"].size(), 1);
    EXPECT_EQ(result["data"][0]["record"]["p1"], "v1");

    // Txn auto rollback when de-construct.
    // txn.rollback();
}

TEST_F(ServerHttpResponseTest, ResponseHandler) {
    HttpClient client("localhost:" + to_string(TEST_PORT));

    auto response = client.request("POST", "/SQL/execute", json{{"sql", "CREATE CLASS 'V' IF NOT EXISTS EXTENDS VERTEX"}}.dump());
    auto result = json::parse(response->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::CLASS_DESCRIPTOR);
    EXPECT_EQ(result["data"]["name"], "V");

    response = client.request("POST", "/SQL/execute", json{{"sql", "DROP CLASS 'V' IF EXISTS"}}.dump());
    result = json::parse(response->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::NO_RESULT);
}


