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
#include <nlohmann/json.hpp>

#include "../src/translator.hpp"

using namespace std;
using namespace nogdb;
using nlohmann::json;

namespace nogdb {
    bool operator==(const PropertyDescriptor &lhs, const PropertyDescriptor &rhs) {
        return (lhs.id == rhs.id
                && lhs.type == rhs.type
                && lhs.indexInfo == rhs.indexInfo);
    }

    bool operator==(const ClassDescriptor &lhs, const ClassDescriptor &rhs) {
        return (lhs.id == rhs.id
                && lhs.name == rhs.name
                && lhs.type == rhs.type
                && lhs.properties == rhs.properties
                && lhs.super == rhs.super
                && lhs.sub == rhs.sub);
    }

    bool operator==(const RecordDescriptor &lhs, const RecordDescriptor &rhs) {
        return lhs.rid == rhs.rid;
    }

    bool operator==(const Bytes &lhs, const Bytes &rhs) {
        return lhs.size() == rhs.size() && memcmp(lhs.getRaw(), rhs.getRaw(), lhs.size()) == 0;
    }

    bool operator==(const Result &lhs, const Result &rhs) {
        return lhs.descriptor == rhs.descriptor && lhs.record.getAll() == rhs.record.getAll();
    }

    class SQLResultTesting : public SQL::Result {
    public:
        SQLResultTesting() : SQL::Result() {}
        SQLResultTesting(Error *error) : SQL::Result(error) {}
        SQLResultTesting(ClassDescriptor *classDescriptor) : SQL::Result(classDescriptor) {}
        SQLResultTesting(PropertyDescriptor *propertyDescriptor) : SQL::Result(propertyDescriptor) {}
        SQLResultTesting(std::vector<RecordDescriptor> *recordDescriptor) : SQL::Result(recordDescriptor) {}
        SQLResultTesting(ResultSet *resultSet) : SQL::Result(resultSet) {}

        bool operator==(const SQLResultTesting &rhs) const {
            if (this->t == rhs.t) {
                switch (this->t) {
                    case SQL::Result::NO_RESULT:
                        return true;
                    case SQL::Result::ERROR:
                        return this->get<Error>().code() == rhs.get<Error>().code();
                    case SQL::Result::CLASS_DESCRIPTOR:
                        return this->get<ClassDescriptor>() == rhs.get<ClassDescriptor>();
                    case SQL::Result::PROPERTY_DESCRIPTOR:
                        return this->get<PropertyDescriptor>() == rhs.get<PropertyDescriptor>();
                    case SQL::Result::RECORD_DESCRIPTORS:
                        return this->get<RecordDescriptor>() == rhs.get<RecordDescriptor>();
                    case SQL::Result::RESULT_SET:
                        return this->get<ResultSet>() == rhs.get<ResultSet>();
                    default:
                        break;
                }
            }
            return false;
        }
    };
}

TEST(Translator, TranslateErrorType) {
    EXPECT_EQ(json(Error::Type::DATASTORE).dump(), "\"d\"");
    EXPECT_EQ(json(Error::Type::GRAPH).dump(), "\"g\"");
    EXPECT_EQ(json(Error::Type::CONTEXT).dump(), "\"c\"");
    EXPECT_EQ(json(Error::Type::TRANSACTION).dump(), "\"t\"");
    EXPECT_EQ(json(Error::Type::SQL).dump(), "\"s\"");

    EXPECT_EQ(json::parse("\"d\"").get<Error::Type>(), Error::Type::DATASTORE);
    EXPECT_EQ(json::parse("\"g\"").get<Error::Type>(), Error::Type::GRAPH);
    EXPECT_EQ(json::parse("\"c\"").get<Error::Type>(), Error::Type::CONTEXT);
    EXPECT_EQ(json::parse("\"t\"").get<Error::Type>(), Error::Type::TRANSACTION);
    EXPECT_EQ(json::parse("\"s\"").get<Error::Type>(), Error::Type::SQL);
}

TEST(Translator, TranslateError) {
    auto e = Error(SQL_SYNTAX_ERROR, Error::Type::SQL);
    EXPECT_EQ(json::parse(json(e).dump()), e);
}

TEST(Translator, TranslatePropertyType) {
    EXPECT_EQ(json(PropertyType::TINYINT).dump(), "\"i\"");
    EXPECT_EQ(json(PropertyType::UNSIGNED_TINYINT).dump(), "\"I\"");
    EXPECT_EQ(json(PropertyType::SMALLINT).dump(), "\"s\"");
    EXPECT_EQ(json(PropertyType::UNSIGNED_SMALLINT).dump(), "\"S\"");
    EXPECT_EQ(json(PropertyType::INTEGER).dump(), "\"d\"");
    EXPECT_EQ(json(PropertyType::UNSIGNED_INTEGER).dump(), "\"D\"");
    EXPECT_EQ(json(PropertyType::BIGINT).dump(), "\"l\"");
    EXPECT_EQ(json(PropertyType::UNSIGNED_BIGINT).dump(), "\"L\"");
    EXPECT_EQ(json(PropertyType::TEXT).dump(), "\"t\"");
    EXPECT_EQ(json(PropertyType::REAL).dump(), "\"f\"");
    EXPECT_EQ(json(PropertyType::BLOB).dump(), "\"b\"");
    EXPECT_EQ(json(PropertyType::UNDEFINED).dump(), "\"n\"");

    EXPECT_EQ(json::parse("\"i\"").get<PropertyType>(), PropertyType::TINYINT);
    EXPECT_EQ(json::parse("\"I\"").get<PropertyType>(), PropertyType::UNSIGNED_TINYINT);
    EXPECT_EQ(json::parse("\"s\"").get<PropertyType>(), PropertyType::SMALLINT);
    EXPECT_EQ(json::parse("\"S\"").get<PropertyType>(), PropertyType::UNSIGNED_SMALLINT);
    EXPECT_EQ(json::parse("\"d\"").get<PropertyType>(), PropertyType::INTEGER);
    EXPECT_EQ(json::parse("\"D\"").get<PropertyType>(), PropertyType::UNSIGNED_INTEGER);
    EXPECT_EQ(json::parse("\"l\"").get<PropertyType>(), PropertyType::BIGINT);
    EXPECT_EQ(json::parse("\"L\"").get<PropertyType>(), PropertyType::UNSIGNED_BIGINT);
    EXPECT_EQ(json::parse("\"t\"").get<PropertyType>(), PropertyType::TEXT);
    EXPECT_EQ(json::parse("\"f\"").get<PropertyType>(), PropertyType::REAL);
    EXPECT_EQ(json::parse("\"b\"").get<PropertyType>(), PropertyType::BLOB);
    EXPECT_EQ(json::parse("\"n\"").get<PropertyType>(), PropertyType::UNDEFINED);
}

TEST(Translator, TranslatePropertyDescriptor) {
    auto p = PropertyDescriptor{
        1,
        PropertyType::INTEGER,
        IndexInfo{
            { 11, make_pair(101, true) },
            { 12, make_pair(102, false) }
        }
    };
    ASSERT_EQ(json(p).dump(), json::parse(R"({"id":1,"type":"d","indexInfo":{"11":[101,true],"12":[102,false]}})").dump());
    EXPECT_EQ(json::parse(json(p).dump()).get<PropertyDescriptor>(), p);
}

TEST(Translator, TranslateClassType) {
    EXPECT_EQ(json(ClassType::VERTEX).dump(), "\"v\"");
    EXPECT_EQ(json(ClassType::EDGE).dump(), "\"e\"");
    EXPECT_EQ(json(ClassType::UNDEFINED).dump(), "\"n\"");

    EXPECT_EQ(json::parse("\"v\"").get<ClassType>(), ClassType::VERTEX);
    EXPECT_EQ(json::parse("\"e\"").get<ClassType>(), ClassType::EDGE);
    EXPECT_EQ(json::parse("\"n\"").get<ClassType>(), ClassType::UNDEFINED);
}

TEST(Translator, TranslateClassDescriptor) {
    auto c = ClassDescriptor(1,
                             "MyClass",
                             ClassType::VERTEX,
                             ClassProperty{
                                 {"prop1", PropertyDescriptor(1, PropertyType::TEXT)},
                                 {"prop2", PropertyDescriptor(2, PropertyType::INTEGER)}},
                             "SuperClass",
                             { "SubClass1", "SubClass2" });
    ASSERT_EQ(json(c).dump(), json::parse(R"({"id":1,"name":"MyClass","properties":{"prop1":{"id":1,"indexInfo":null,"type":"t"},"prop2":{"id":2,"indexInfo":null,"type":"d"}},"sub":["SubClass1","SubClass2"],"super":"SuperClass","type":"v"})").dump());
    EXPECT_EQ(json::parse(json(c).dump()).get<ClassDescriptor>(), c);
}

TEST(Translator, TranslateRecordDescriptor) {
    auto r = RecordDescriptor(10, 101);
    ASSERT_EQ(json(r).dump(), R"({"rid":[10,101]})");
    EXPECT_EQ(json::parse(json(r).dump()).get<RecordDescriptor>(), r);
}

TEST(Translator, TranslateBytes) {
    EXPECT_EQ(json(Bytes(0x112348D0)).dump(), "\"X'D0482311'\"");
    EXPECT_EQ(json::parse("\"X'D0482311'\"").get<Bytes>(), Bytes(0x112348D0));
}

TEST(Translator, TranslateBytesWithType) {
    auto tiny = Bytes((int8_t)CHAR_MIN);
    auto utiny = Bytes((uint8_t)UCHAR_MAX);
    auto small = Bytes((int16_t)SHRT_MIN);
    auto usmall = Bytes((uint16_t)USHRT_MAX);
    auto integer = Bytes((int32_t)INT_MIN);
    auto uinteger = Bytes((uint32_t)UINT_MAX);
    auto bigint = Bytes((int64_t)LLONG_MIN);
    auto ubigint = Bytes((uint64_t)ULLONG_MAX);
    auto text = Bytes("Hello");
    auto real = Bytes(3.141);
    auto blob = Bytes(0x11235813);

    json j;
    to_json(j, tiny, PropertyType::TINYINT);
    EXPECT_EQ(j.dump(), to_string(CHAR_MIN));
    to_json(j, utiny, PropertyType::UNSIGNED_TINYINT);
    EXPECT_EQ(j.dump(), to_string(UCHAR_MAX));
    to_json(j, small, PropertyType::SMALLINT);
    EXPECT_EQ(j.dump(), to_string(SHRT_MIN));
    to_json(j, usmall, PropertyType::UNSIGNED_SMALLINT);
    EXPECT_EQ(j.dump(), to_string(USHRT_MAX));
    to_json(j, integer, PropertyType::INTEGER);
    EXPECT_EQ(j.dump(), to_string(INT_MIN));
    to_json(j, uinteger, PropertyType::UNSIGNED_INTEGER);
    EXPECT_EQ(j.dump(), to_string(UINT_MAX));
    to_json(j, bigint, PropertyType::BIGINT);
    EXPECT_EQ(j.dump(), to_string(LLONG_MIN));
    to_json(j, ubigint, PropertyType::UNSIGNED_BIGINT);
    EXPECT_EQ(j.dump(), to_string(ULLONG_MAX));
    to_json(j, text, PropertyType::TEXT);
    EXPECT_EQ(j.dump(), "\"Hello\"");
    to_json(j, real, PropertyType::REAL);
    EXPECT_EQ(j.dump(), "3.141");
    to_json(j, blob, PropertyType::BLOB);
    EXPECT_EQ(j.dump(), "\"X'13582311'\"");

    Bytes b;
    from_json(json((int8_t)CHAR_MIN), b, PropertyType::TINYINT);
    EXPECT_EQ(b, tiny);
    from_json(json((uint8_t)UCHAR_MAX), b, PropertyType::UNSIGNED_TINYINT);
    EXPECT_EQ(b, utiny);
    from_json(json((int16_t)SHRT_MIN), b, PropertyType::SMALLINT);
    EXPECT_EQ(b, small);
    from_json(json((uint16_t)USHRT_MAX), b, PropertyType::UNSIGNED_SMALLINT);
    EXPECT_EQ(b, usmall);
    from_json(json((int32_t)INT_MIN), b, PropertyType::INTEGER);
    EXPECT_EQ(b, integer);
    from_json(json((uint32_t)UINT_MAX), b, PropertyType::UNSIGNED_INTEGER);
    EXPECT_EQ(b, uinteger);
    from_json(json((int64_t)LLONG_MIN), b, PropertyType::BIGINT);
    EXPECT_EQ(b, bigint);
    from_json(json((uint64_t)ULLONG_MAX), b, PropertyType::UNSIGNED_BIGINT);
    EXPECT_EQ(b, ubigint);
    from_json(json("Hello"), b, PropertyType::TEXT);
    EXPECT_EQ(b, text);
    from_json(json(3.141), b, PropertyType::REAL);
    EXPECT_EQ(b, real);
    from_json(json("X'13582311'"), b, PropertyType::BLOB);
    EXPECT_EQ(b, blob);
}

TEST(Translator, TranslateResult) {
    auto rs = Result(RecordDescriptor(2, 3),
                     Record().set("prop1", (uint8_t)0x11).set("prop2", (uint8_t)0x22));
    ASSERT_EQ(json(rs).dump(), R"({"descriptor":{"rid":[2,3]},"record":{"prop1":"X'11'","prop2":"X'22'"}})");
    EXPECT_EQ(json::parse(json(rs).dump()).get<Result>(), rs);
}

TEST(Translator, TranslateResultWithSchema) {
    auto schemas = vector<ClassDescriptor>{
        ClassDescriptor(2,
                        "My_class",
                        ClassType::VERTEX,
                        ClassProperty{
                            { "prop1", { 11, PropertyType::TEXT }},
                            { "prop2", { 12, PropertyType::REAL }}
                        }),
        ClassDescriptor(303, "Another_class", ClassType::UNDEFINED, {})
    };
    auto rs = Result(RecordDescriptor(2, 3),
                     Record().set("prop1", "Hello").set("prop2", 3.141));

    json j;
    to_json(j, rs, schemas);
    ASSERT_EQ(j.dump(), R"({"descriptor":{"rid":[2,3]},"record":{"prop1":"Hello","prop2":3.141}})");

    Result testRs;
    from_json(j, testRs, schemas);
    EXPECT_EQ(testRs, rs);
}

TEST(Translator, TranslateResultWithSchemaButInvalidClass) {
    auto schemas = vector<ClassDescriptor>{ClassDescriptor(111, "Class", ClassType::UNDEFINED, {})};
    auto rs = Result(RecordDescriptor(2, 3), Record().set("prop1", (uint8_t)0x11));

    json j;
    to_json(j, rs, schemas);
    ASSERT_EQ(j.dump(), R"({"descriptor":{"rid":[2,3]},"record":{"prop1":"X'11'"}})");

    Result testRs;
    from_json(j, testRs, schemas);
    EXPECT_EQ(testRs, rs);
}

TEST(Translator, TranslateSQLResultType) {
    EXPECT_EQ(json(SQL::Result::Type::NO_RESULT).dump(), "\"n\"");
    EXPECT_EQ(json(SQL::Result::Type::ERROR).dump(), "\"e\"");
    EXPECT_EQ(json(SQL::Result::Type::CLASS_DESCRIPTOR).dump(), "\"c\"");
    EXPECT_EQ(json(SQL::Result::Type::PROPERTY_DESCRIPTOR).dump(), "\"p\"");
    EXPECT_EQ(json(SQL::Result::Type::RECORD_DESCRIPTORS).dump(), "\"r\"");
    EXPECT_EQ(json(SQL::Result::Type::RESULT_SET).dump(), "\"s\"");

    EXPECT_EQ(json::parse("\"n\"").get<SQL::Result::Type>(), SQL::Result::Type::NO_RESULT);
    EXPECT_EQ(json::parse("\"e\"").get<SQL::Result::Type>(), SQL::Result::Type::ERROR);
    EXPECT_EQ(json::parse("\"c\"").get<SQL::Result::Type>(), SQL::Result::Type::CLASS_DESCRIPTOR);
    EXPECT_EQ(json::parse("\"p\"").get<SQL::Result::Type>(), SQL::Result::Type::PROPERTY_DESCRIPTOR);
    EXPECT_EQ(json::parse("\"r\"").get<SQL::Result::Type>(), SQL::Result::Type::RECORD_DESCRIPTORS);
    EXPECT_EQ(json::parse("\"s\"").get<SQL::Result::Type>(), SQL::Result::Type::RESULT_SET);
}

TEST(Translator, TranslateSQLResultNoResult) {
    EXPECT_EQ(json(SQLResultTesting()).dump(), json::parse(R"({"type":"n","data":null})").dump());
}

TEST(Translator, TranslateSQLResultError) {
    auto rs = SQLResultTesting(new Error(SQL_SYNTAX_ERROR, Error::Type::SQL));
    EXPECT_EQ(json(rs).dump(), (json{{"type","e"},{"data",rs.get<Error>()}}.dump()));;
}

TEST(Translator, TranslateSQLResultClassDescriptor) {
    auto rs = SQLResultTesting(new ClassDescriptor(2, "C", ClassType::VERTEX, {}));
    EXPECT_EQ(json(rs).dump(), (json{{"type", "c"},{"data",rs.get<ClassDescriptor>()}}.dump()));
}

TEST(Translator, TranslateSQLResultPropertyDescriptor) {
    auto rs = SQLResultTesting(new PropertyDescriptor(2, PropertyType::TEXT));
    EXPECT_EQ(json(rs).dump(), (json{{"type","p"},{"data",rs.get<PropertyDescriptor>()}}.dump()));
}

TEST(Translator, TranslateSQLResultRecordDescriptor) {
    auto rs = SQLResultTesting(new vector<RecordDescriptor>{{2,3}, {2,4}});
    EXPECT_EQ(json(rs).dump(), (json{{"type","r"},{"data",rs.get<vector<RecordDescriptor>>()}}.dump()));
}

TEST(Translator, TranslateSQLResultResultSet) {
    auto schemas = vector<ClassDescriptor>{
        ClassDescriptor(2,
                        "My_class",
                        ClassType::VERTEX,
                        ClassProperty{
                            { "prop1", { 11, PropertyType::TEXT }},
                            { "prop2", { 12, PropertyType::REAL }}
                        }),
        ClassDescriptor(303, "Another_class", ClassType::UNDEFINED, {})
    };
    auto rs = SQLResultTesting(new ResultSet{
        {{2,3}, Record().set("prop1", "Hello").set("prop2",3.141)},
        {{2,4}, Record().set("prop1", "World").set("prop2",1.618)}
    });

    json j, jRss;
    to_json(j, rs, schemas);

    for (const auto &r: rs.get<ResultSet>()) {
        json jR;
        to_json(jR, r, schemas);
        jRss.push_back(move(jR));
    }

    EXPECT_EQ(j.at("type").get<string>(), "s");
    EXPECT_EQ(j.at("data").dump(), jRss.dump());
}

TEST(Translator, TranslateIndexInfo) {
    auto ii = IndexInfo{
        { 1, make_pair(11, true) },
        { 2, make_pair(12, false) }
    };
    ASSERT_EQ(json(ii).dump(), R"({"1":[11,true],"2":[12,false]})");
    EXPECT_EQ(json::parse(json(ii).dump()).get<IndexInfo>(), ii);
}
