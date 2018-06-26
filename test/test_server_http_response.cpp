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
static const auto TEST_PORT = (unsigned short)8090;
static const auto TEST_ADDESS = string("localhost:") + to_string(TEST_PORT);

class ServerHttpResponseTest : public testing::Test {
protected:
    virtual void SetUp() {
        system("rm -rf " TEST_DBPART);
        ctx = server::Context(TEST_DBPART);
        server.config.port = TEST_PORT;
        server::setupHttpResponse(server, ctx);
        svThread = thread([&]() { server.start(); });
        this_thread::sleep_for(chrono::milliseconds(5));
    }
     virtual void TearDown() {
         server.stop();
         svThread.join();
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
    HttpClient client(TEST_ADDESS);

    auto response = client.request("POST", "/SQL/execute", json{{"sql", "CREATE CLASS 'V' IF NOT EXISTS EXTENDS VERTEX"}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
    auto result = json::parse(response->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::CLASS_DESCRIPTOR);
    EXPECT_EQ(result["data"]["name"], "V");

    response = client.request("POST", "/SQL/execute", json{{"sql", "DROP CLASS 'V' IF EXISTS"}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
    result = json::parse(response->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::NO_RESULT);
}

TEST_F(ServerHttpResponseTest, ResponseHandlerTransaction) {
    HttpClient client(TEST_ADDESS);

    // create txn1
    auto response = client.request("POST", "/Txn/create", json{{"mode", "READ_WRITE"}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
    auto result = json::parse(response->content.string());
    ASSERT_TRUE(result["txnID"].is_number());
    TxnId txnID1 = result["txnID"].get<TxnId>();

    // create class 'V' in txn1
    response = client.request("POST", "/SQL/execute", json{{"txnID", txnID1}, {"sql", "CREATE CLASS V IF NOT EXISTS EXTENDS VERTEX"}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
    result = json::parse(response->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::CLASS_DESCRIPTOR);
    EXPECT_EQ(result["data"]["name"], "V");

    // create txn2
    response = client.request("POST", "/Txn/create", json{{"mode", "READ_ONLY"}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
    result = json::parse(response->content.string());
    ASSERT_TRUE(result["txnID"].is_number());
    TxnId txnID2 = result["txnID"].get<TxnId>();

    // txn2 can't find class 'V' because txn1 hasn't commited.
    response = client.request("POST", "/SQL/execute", json{{"txnID", txnID2}, {"sql", "SELECT * FROM V"}}.dump());
    ASSERT_EQ(response->status_code, "500 Internal Server Error");
    result = json::parse(response->content.string());
    EXPECT_EQ(result["error"], "CTX_NOEXST_CLASS: A class does not exist");

    // commit txn1
    response = client.request("POST", "/Txn/commit", json{{"txnID", txnID1}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
    result = json::parse(response->content.string());
    EXPECT_TRUE(result.is_object());
    EXPECT_EQ(result.size(), 0);

    // other txn can find class 'V'
    response = client.request("POST", "/SQL/execute", json{{"sql", "SELECT * FROM V"}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
    result = json::parse(response->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::RESULT_SET);
    EXPECT_EQ(result["data"].size(), 0);

    // rollback txn2
    response = client.request("POST", "/Txn/rollback", json{{"txnID", txnID2}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
    result = json::parse(response->content.string());
    EXPECT_TRUE(result.is_object());
    EXPECT_EQ(result.size(), 0);

    // clean-up
    response = client.request("POST", "/SQL/execute", json{{"sql", "DROP CLASS V IF EXISTS"}}.dump());
    ASSERT_EQ(response->status_code, "200 OK");
}
