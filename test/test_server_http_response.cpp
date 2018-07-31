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

#include "test_nogdb_util.hpp"
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

    void InitVertexAndEdge(size_t vertexSize, bool createEdge = false) {
        auto txn = Txn(ctx, Txn::Mode::READ_WRITE);
        Class::create(txn, classNameV, ClassType::VERTEX);
        Property::add(txn, classNameV, propName, PropertyType::TEXT);
        for (auto i = 0; i < vertexSize; i++) {
            recD.push_back(Vertex::create(txn, classNameV, Record().set(propName, propValue + to_string(i))));
        }
        Class::create(txn, classNameE, ClassType::EDGE);
        Property::add(txn, classNameE, propName, PropertyType::TEXT);
        if (createEdge == true) {
            assert(vertexSize >= 2);
            edgeDesc = Edge::create(txn, classNameE, recD[0], recD[1], Record().set(propName, propValue));
        }
        txn.commit();
    }

    void InitTraverse() {
        InitVertexAndEdge(6);
        auto txn = Txn(ctx, Txn::Mode::READ_WRITE);
        Edge::create(txn, classNameE, recD[0], recD[1], Record().set(propName, propValue));
        Edge::create(txn, classNameE, recD[0], recD[2], Record().set(propName, propValue));
        Edge::create(txn, classNameE, recD[1], recD[3], Record().set(propName, propValue));
        Edge::create(txn, classNameE, recD[1], recD[4], Record().set(propName, propValue));
        Edge::create(txn, classNameE, recD[2], recD[5], Record().set(propName, propValue));
        txn.commit();
    }

    server::Context ctx;
    HttpServer server;
    thread svThread;

    string classNameV{"v"};
    string classNameE{"e"};
    string propName{"prop1"};
    string propValue{"value"};
    vector<RecordDescriptor> recD{};
    RecordDescriptor edgeDesc;
};


TEST_F(ServerHttpResponseTest, ResponseHandler) {
    HttpClient client(TEST_ADDESS);

    auto response = client.request("POST", "/SQL/execute", json{{"sql", "CREATE CLASS 'V' IF NOT EXISTS EXTENDS VERTEX"}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ(SQL::Result::Type::CLASS_DESCRIPTOR, result["type"]);
    EXPECT_EQ("V", result["data"]["name"]);

    response = client.request("POST", "/SQL/execute", json{{"sql", "DROP CLASS 'V' IF EXISTS"}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ(SQL::Result::Type::NO_RESULT, result["type"]);
}

TEST_F(ServerHttpResponseTest, ResponseHandlerTransaction) {
    HttpClient client(TEST_ADDESS);

    // create txn1
    auto response = client.request("POST", "/Txn/create", json{{"mode", "READ_WRITE"}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_TRUE(result["txnID"].is_number());
    TxnId txnID1 = result["txnID"].get<TxnId>();

    // create class 'V' in txn1
    response = client.request("POST", "/SQL/execute", json{
        {"txnID", txnID1},
        {"sql", "CREATE CLASS V IF NOT EXISTS EXTENDS VERTEX"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ(SQL::Result::Type::CLASS_DESCRIPTOR, result["type"]);
    EXPECT_EQ("V", result["data"]["name"]);

    // create txn2
    response = client.request("POST", "/Txn/create", json{{"mode", "READ_ONLY"}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    ASSERT_TRUE(result["txnID"].is_number());
    TxnId txnID2 = result["txnID"].get<TxnId>();

    // txn2 can't find class 'V' because txn1 hasn't commited.
    response = client.request("POST", "/SQL/execute", json{
        {"txnID", txnID2},
        {"sql", "SELECT * FROM V"}
    }.dump());
    ASSERT_EQ("500 Internal Server Error", response->status_code);
    result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ("CTX_NOEXST_CLASS: A class does not exist", result["error"]);

    // commit txn1
    response = client.request("POST", "/Txn/commit", json{{"txnID", txnID1}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    EXPECT_TRUE(result.is_object());
    EXPECT_EQ(0, result.size());

    // other txn can find class 'V'
    response = client.request("POST", "/SQL/execute", json{{"sql", "SELECT * FROM V"}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ(SQL::Result::Type::RESULT_SET, result["type"]);
    EXPECT_EQ(0, result["data"].size());

    // rollback txn2
    response = client.request("POST", "/Txn/rollback", json{{"txnID", txnID2}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    EXPECT_TRUE(result.is_object());
    EXPECT_EQ(0, result.size());

    // clean-up
    response = client.request("POST", "/SQL/execute", json{{"sql", "DROP CLASS V IF EXISTS"}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
}

TEST_F(ServerHttpResponseTest, ResponseClassCreate) {
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Class/create", json{
        {"className", "v"},
        {"type", "v"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ClassDescriptor>());
    EXPECT_EQ("v", result["name"]);
    EXPECT_EQ("v", result["type"]);
}

TEST_F(ServerHttpResponseTest, ResponseClassCreateExtend) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Class/createExtend", json{
        {"className", "v2"},
        {"superClass", this->classNameV}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ClassDescriptor>());
    EXPECT_EQ("v2", result["name"]);
    EXPECT_EQ(this->classNameV, result["super"]);
}

TEST_F(ServerHttpResponseTest, ResponseClassDrop) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Class/drop", json{{"className", this->classNameV}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_THROW(Db::getSchema({this->ctx, Txn::Mode::READ_ONLY}, this->classNameV), nogdb::Error);
}

TEST_F(ServerHttpResponseTest, ResponseClassAlter) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Class/alter", json{
        {"oldClassName", this->classNameV},
        {"newClassName", "v2"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    auto txn = Txn(this->ctx, Txn::Mode::READ_ONLY);
    EXPECT_THROW(Db::getSchema(txn, this->classNameV), nogdb::Error);
    EXPECT_NO_THROW(Db::getSchema(txn, "v2"));
}

TEST_F(ServerHttpResponseTest, ResponsePropertyAdd) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Property/add", json{
        {"className", this->classNameV},
        {"propertyName", "prop"},
        {"type", "t"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<PropertyDescriptor>());
    EXPECT_EQ("t", result["type"]);
}

TEST_F(ServerHttpResponseTest, ResponsePropertyAlter) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Property/alter", json{
        {"className", this->classNameV},
        {"oldPropertyName", this->propName},
        {"newPropertyName", "prop2"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    auto txn = Txn(this->ctx, Txn::Mode::READ_ONLY);
    EXPECT_THROW(Db::getSchema(txn, this->classNameV).properties.at(this->propName), std::out_of_range);
    EXPECT_NO_THROW(Db::getSchema(txn, this->classNameV).properties.at("prop2"));
}

TEST_F(ServerHttpResponseTest, ResponsePropertyRemove) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Property/remove", json{
        {"className", this->classNameV},
        {"propertyName", this->propName}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_THROW(Db::getSchema({this->ctx, Txn::Mode::READ_ONLY},
                               this->classNameV).properties.at(this->propName),
                 std::out_of_range);
}

TEST_F(ServerHttpResponseTest, ResponsePropertyCreateIndex) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Property/createIndex", json{
        {"className", this->classNameV},
        {"propertyName", this->propName},
        {"isUnique", true}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_EQ(1, Db::getSchema({this->ctx, Txn::Mode::READ_ONLY},
                               this->classNameV).properties.at(this->propName).indexInfo.size());
}

TEST_F(ServerHttpResponseTest, ResponsePropertyDropIndex) {
    this->InitVertexAndEdge(0);
    auto txn = Txn(this->ctx, Txn::Mode::READ_WRITE);
    Property::createIndex(txn, this->classNameV, this->propName);
    txn.commit();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Property/dropIndex", json{
        {"className", this->classNameV},
        {"propertyName", this->propName}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_EQ(0, Db::getSchema({this->ctx, Txn::Mode::READ_ONLY},
                               this->classNameV).properties.at(this->propName).indexInfo.size());
}

TEST_F(ServerHttpResponseTest, ResponseVertexCreate) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Vertex/create", json{
        {"className", this->classNameV},
        {"record", {
            {this->propName, "value1"}
        }}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    RecordDescriptor recD;
    ASSERT_NO_THROW(recD = result.get<RecordDescriptor>());
    auto rec = Db::getRecord({this->ctx, Txn::Mode::READ_ONLY}, recD);
    EXPECT_EQ("value1", rec.getText(this->propName));
}

TEST_F(ServerHttpResponseTest, ResponseVertexUpdate) {
    this->InitVertexAndEdge(1);
    auto txn = Txn(this->ctx, Txn::Mode::READ_WRITE);
    auto recD = Vertex::create(txn, this->classNameV, Record().set(this->propName, "value0"));
    txn.commit();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Vertex/update", json{
        {"recordDescriptor", recD},
        {"record", {
            {this->propName, "value2"}
        }}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    auto rec = Db::getRecord({this->ctx, Txn::Mode::READ_ONLY}, recD);
    EXPECT_EQ("value2", rec.getText(this->propName));
}

TEST_F(ServerHttpResponseTest, ResponseVertexDestroyWithRecordDescriptor) {
    this->InitVertexAndEdge(1);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Vertex/destroy", json{{"recordDescriptor", this->recD[0]}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_THROW(Db::getRecord({this->ctx, Txn::Mode::READ_ONLY}, this->recD[0]).empty(), nogdb::Error);
}

TEST_F(ServerHttpResponseTest, ResponseVertexDestroyWithClassName) {
    this->InitVertexAndEdge(3);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Vertex/destroy", json{{"className", this->classNameV}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_TRUE(Vertex::get({this->ctx, Txn::Mode::READ_ONLY}, this->classNameV).empty());
}

TEST_F(ServerHttpResponseTest, ResponseVertexGet) {
    this->InitVertexAndEdge(2);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Vertex/get", json{{"className", this->classNameV}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(2, result.size());
    EXPECT_EQ(this->recD[0], result[0]["descriptor"].get<RecordDescriptor>());
    EXPECT_EQ("value0", result[0]["record"][this->propName]);
    EXPECT_EQ(this->classNameV, result[0]["record"]["@className"]);
    EXPECT_EQ(this->recD[1], result[1]["descriptor"].get<RecordDescriptor>());
    EXPECT_EQ("value1", result[1]["record"][this->propName]);
    EXPECT_EQ(this->classNameV, result[1]["record"]["@className"]);
}

TEST_F(ServerHttpResponseTest, ResponseVertexGetInEdge) {
    this->InitVertexAndEdge(2, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Vertex/getInEdge", json{{"recordDescriptor", this->recD[1]}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(1, result.size());
    EXPECT_EQ(this->edgeDesc, result[0]["descriptor"].get<RecordDescriptor>());
}

TEST_F(ServerHttpResponseTest, ResponseVertexGetOutEdge) {
    this->InitVertexAndEdge(2, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Vertex/getOutEdge", json{{"recordDescriptor", this->recD[0]}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(1, result.size());
    EXPECT_EQ(this->edgeDesc, result[0]["descriptor"].get<RecordDescriptor>());
}

TEST_F(ServerHttpResponseTest, ResponseVertexGetAllEdge) {
    this->InitVertexAndEdge(2);
    auto txn = Txn(this->ctx, Txn::Mode::READ_WRITE);
    Class::create(txn, "e1", ClassType::EDGE);
    Class::create(txn, "e2", ClassType::EDGE);
    auto e01 = Edge::create(txn, "e1", this->recD[0], this->recD[1]);
    auto e10 = Edge::create(txn, "e1", this->recD[1], this->recD[0]);
    Edge::create(txn, "e2", this->recD[0], this->recD[1]);
    txn.commit();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Vertex/getAllEdge", json{
        {"recordDescriptor", this->recD[0]},
        {"classFilter", {"e1"}}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    EXPECT_EQ(2, result.size());
    EXPECT_EQ(e01, result[0]["descriptor"].get<RecordDescriptor>());
    EXPECT_EQ(e10, result[1]["descriptor"].get<RecordDescriptor>());
}

TEST_F(ServerHttpResponseTest, ResponseEdgeCreate) {
    this->InitVertexAndEdge(2);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/create", json{
        {"className", this->classNameE},
        {"srcVertexRecordDescriptor", this->recD[0]},
        {"dstVertexRecordDescriptor", this->recD[1]},
        {"record", {
            {this->propName, "value0"}
        }}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<RecordDescriptor>());
    auto txn = Txn(this->ctx, Txn::Mode::READ_ONLY);
    EXPECT_EQ("value0", Db::getRecord(txn, result.get<RecordDescriptor>()).getText(this->propName));
    EXPECT_EQ(result.get<RecordDescriptor>(), Vertex::getAllEdge(txn, this->recD[0]).at(0).descriptor);
}

TEST_F(ServerHttpResponseTest, ResponseEdgeUpdate) {
    this->InitVertexAndEdge(2, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/update", json{
        {"recordDescriptor", this->edgeDesc},
        {"record", {
            {this->propName, "value2"}
        }}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    auto rec = Db::getRecord({this->ctx, Txn::Mode::READ_ONLY}, this->edgeDesc);
    EXPECT_EQ("value2", rec.getText(this->propName));
}

TEST_F(ServerHttpResponseTest, ResponseEdgeUpdateSrc) {
    this->InitVertexAndEdge(3, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/updateSrc", json{
        {"recordDescriptor", this->edgeDesc},
        {"newSrcVertexRecordDescriptor", this->recD[2]}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_EQ(this->recD[2], Edge::getSrc({this->ctx, Txn::Mode::READ_ONLY}, this->edgeDesc).descriptor);
}

TEST_F(ServerHttpResponseTest, ResponseEdgeUpdateDst) {
    this->InitVertexAndEdge(3, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/updateDst", json{
        {"recordDescriptor", this->edgeDesc},
        {"newDstVertexRecordDescriptor", this->recD[2]}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_EQ(this->recD[2], Edge::getDst({this->ctx, Txn::Mode::READ_ONLY}, this->edgeDesc).descriptor);
}

TEST_F(ServerHttpResponseTest, ResponseEdgeDestroyWithRecordDescriptor) {
    this->InitVertexAndEdge(2, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/destroy", json{{"recordDescriptor", this->edgeDesc}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_THROW(Db::getRecord({this->ctx, Txn::Mode::READ_ONLY}, this->edgeDesc).empty(), nogdb::Error);
}

TEST_F(ServerHttpResponseTest, ResponseEdgeDestroyWithClassName) {
    this->InitVertexAndEdge(3);
    auto txn = Txn(this->ctx, Txn::Mode::READ_WRITE);
    Edge::create(txn, this->classNameE, this->recD[0], this->recD[1]);
    Edge::create(txn, this->classNameE, this->recD[0], this->recD[2]);
    Edge::create(txn, this->classNameE, this->recD[1], this->recD[0]);
    txn.commit();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/destroy", json{{"className", this->classNameE}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_EQ(json::object(), result);
    EXPECT_TRUE(Edge::get({this->ctx, Txn::Mode::READ_ONLY}, this->classNameE).empty());
}

TEST_F(ServerHttpResponseTest, ResponseEdgeGet) {
    this->InitVertexAndEdge(2, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/get", json{{"className", this->classNameE}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(1, result.size());
    EXPECT_EQ(this->edgeDesc, result[0]["descriptor"].get<RecordDescriptor>());
    EXPECT_EQ(this->propValue, result[0]["record"][this->propName]);
}

TEST_F(ServerHttpResponseTest, ResponseEdgeGetSrc) {
    this->InitVertexAndEdge(2, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/getSrc", json{{"recordDescriptor", this->edgeDesc}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<Result>());
    EXPECT_EQ(this->recD[0], result["descriptor"].get<RecordDescriptor>());
}

TEST_F(ServerHttpResponseTest, ResponseEdgeGetDst) {
    this->InitVertexAndEdge(2, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/getDst", json{{"recordDescriptor", this->edgeDesc}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<Result>());
    EXPECT_EQ(this->recD[1], result["descriptor"].get<RecordDescriptor>());
}

TEST_F(ServerHttpResponseTest, ResponseEdgeGetSrcDst) {
    this->InitVertexAndEdge(2, true);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Edge/getSrcDst", json{{"recordDescriptor", this->edgeDesc}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(2, result.size());
    EXPECT_EQ(this->recD[0], result[0]["descriptor"].get<RecordDescriptor>());
    EXPECT_EQ(this->recD[1], result[1]["descriptor"].get<RecordDescriptor>());
}

TEST_F(ServerHttpResponseTest, ResponseDbGetRecord) {
    this->InitVertexAndEdge(1);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Db/getRecord", json{{"recordDescriptor", this->recD[0]}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<Record>());
    EXPECT_EQ("value0", result[this->propName]);
}

TEST_F(ServerHttpResponseTest, ResponseDbGetSchema) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Db/getSchema", json::object().dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    auto expectResult = json(Db::getSchema({this->ctx, Txn::Mode::READ_ONLY}));
    EXPECT_EQ(expectResult, result);
}

TEST_F(ServerHttpResponseTest, ResponseDbGetSchemaWithClassName) {
    this->InitVertexAndEdge(0);
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Db/getSchema", json{{"className", this->classNameV}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    auto expectResult = json(Db::getSchema({this->ctx, Txn::Mode::READ_ONLY}, this->classNameV));
    EXPECT_EQ(expectResult, result);
}

TEST_F(ServerHttpResponseTest, ResponseDbGetSchemaWithClassId) {
    auto txn = Txn(this->ctx, Txn::Mode::READ_WRITE);
    auto classD = Class::create(txn, "test_class", ClassType::VERTEX);
    txn.commit();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Db/getSchema", json{{"classId", classD.id}}.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    auto expectResult = json(Db::getSchema({this->ctx, Txn::Mode::READ_ONLY}, classD.id));
    EXPECT_EQ(expectResult, result);
}

TEST_F(ServerHttpResponseTest, ResponseDbGetDbInfo) {
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Db/getDbInfo", json::object().dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<DBInfo>());
    auto expectResult = Db::getDbInfo({this->ctx, Txn::Mode::READ_ONLY});
    EXPECT_EQ(expectResult, result.get<DBInfo>());
}

TEST_F(ServerHttpResponseTest, ResponseTraverseInEdgeBfs) {
    this->InitTraverse();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Traverse/inEdgeBfs", json{
        {"recordDescriptor", this->recD[5]},
        {"minDepth", 0},
        {"maxDepth", 100},
        {"classFilter", json::array()}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(3, result.size());
}

TEST_F(ServerHttpResponseTest, ResponseTraverseOutEdgeBfs) {
    this->InitTraverse();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Traverse/outEdgeBfs", json{
        {"recordDescriptor", this->recD[1]},
        {"minDepth", 0},
        {"maxDepth", 100},
        {"classFilter", json::array()}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(3, result.size());
}

TEST_F(ServerHttpResponseTest, ResponseTraverseAllEdgeBfs) {
    this->InitTraverse();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Traverse/allEdgeBfs", json{
        {"recordDescriptor", this->recD[2]},
        {"minDepth", 0},
        {"maxDepth", 100},
        {"classFilter", json::array()}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(6, result.size());
}

TEST_F(ServerHttpResponseTest, ResponseTraverseInEdgeDfs) {
    this->InitTraverse();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Traverse/inEdgeDfs", json{
        {"recordDescriptor", this->recD[5]},
        {"minDepth", 0},
        {"maxDepth", 100},
        {"classFilter", json::array()}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(3, result.size());
}

TEST_F(ServerHttpResponseTest, ResponseTraverseOutEdgeDfs) {
    this->InitTraverse();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Traverse/outEdgeDfs", json{
        {"recordDescriptor", this->recD[1]},
        {"minDepth", 0},
        {"maxDepth", 100},
        {"classFilter", json::array()}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(3, result.size());
}

TEST_F(ServerHttpResponseTest, ResponseTraverseAllEdgeDfs) {
    this->InitTraverse();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Traverse/allEdgeDfs", json{
        {"recordDescriptor", this->recD[2]},
        {"minDepth", 0},
        {"maxDepth", 100},
        {"classFilter", json::array()}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(6, result.size());
}

TEST_F(ServerHttpResponseTest, ResponseTraverseShortestPath) {
    this->InitTraverse();
    HttpClient client(TEST_ADDESS);
    auto response = client.request("POST", "/Traverse/shortestPath", json{
        {"srcVertexRecordDescriptor", this->recD[0]},
        {"dstVertexRecordDescriptor", this->recD[5]},
        {"classFilter", json::array()}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_NO_THROW(result.get<ResultSet>());
    EXPECT_EQ(3, result.size());
}

TEST_F(ServerHttpResponseTest, ResponseSQLExecute) {
    HttpClient client(TEST_ADDESS);

    auto response = client.request("POST", "/SQL/execute", json{
        {"sql", "CREATE CLASS 'V' IF NOT EXISTS EXTENDS VERTEX"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    auto result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ(SQL::Result::Type::CLASS_DESCRIPTOR, result["type"]);
    EXPECT_EQ("V", result["data"]["name"]);

    response = client.request("POST", "/SQL/execute", json{
        {"sql", "CREATE PROPERTY V.p1 TEXT"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ(SQL::Result::Type::PROPERTY_DESCRIPTOR, result["type"]);
    EXPECT_EQ(PropertyType::TEXT, result["data"]["type"]);

    response = client.request("POST", "/SQL/execute", json{
        {"sql", "CREATE VERTEX V SET p1='v1'"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ(SQL::Result::Type::RECORD_DESCRIPTORS, result["type"]);

    response = client.request("POST", "/SQL/execute", json{
        {"sql", "SELECT * FROM V"}
    }.dump());
    ASSERT_EQ("200 OK", response->status_code);
    result = json::parse(response->content.string());
    ASSERT_TRUE(result.is_object());
    EXPECT_EQ(SQL::Result::Type::RESULT_SET, result["type"]);
    EXPECT_EQ(1, result["data"].size());
    EXPECT_EQ("v1", result["data"][0]["record"]["p1"]);
}
