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

class ServerHttpResponseTest : public testing::Test {
protected:
    virtual void SetUp() {
        ctx = Context("test.db");
        server.config.port = 8090;
        server::setupHttpResponse(server, ctx);
        svThread = thread([&]() { server.start(); });
        this_thread::sleep_for(chrono::milliseconds(5));
    }
     virtual void TearDown() {
         server.stop();
         svThread.join();
         ctx = Context{}; // unlock test.db
         system("rm -r test.db");
     }

    Context ctx;
    HttpServer server;
    thread svThread;
};

TEST_F(ServerHttpResponseTest, ResponseSQLExecute) {
    HttpClient client("localhost:8090");

    auto res = client.request("POST", "/sql/execute", json{{"sql", "CREATE CLASS 'V' IF NOT EXISTS EXTENDS VERTEX"}}.dump());
    auto result = json::parse(res->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::CLASS_DESCRIPTOR);
    EXPECT_EQ(result["data"]["name"], "V");

    res = client.request("POST", "/sql/execute", json{{"sql", "CREATE PROPERTY V.p1 TEXT"}}.dump());
    result = json::parse(res->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::PROPERTY_DESCRIPTOR);
    EXPECT_EQ(result["data"]["type"], PropertyType::TEXT);

    res = client.request("POST", "/sql/execute", json{{"sql", "CREATE VERTEX V SET p1='v1'"}}.dump());
    result = json::parse(res->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::RECORD_DESCRIPTORS);

    res = client.request("POST", "/sql/execute", json{{"sql", "SELECT * FROM V"}}.dump());
    result = json::parse(res->content.string());
    EXPECT_EQ(result["type"], SQL::Result::Type::RESULT_SET);
    EXPECT_EQ(result["data"].size(), 1);
    EXPECT_EQ(result["data"][0]["record"]["p1"], "v1");
}

