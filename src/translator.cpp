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

#include <nogdb/nogdb.h>
#include <nlohmann/json.hpp>

#include "translator.hpp"

using namespace std;
using namespace nogdb;
using namespace nlohmann;


void nogdb::to_json(json &j, const Error::Type &t) {
    j = string(1, static_cast<char>(t));
}
void nogdb::from_json(const json &j, Error::Type &t) {
    if (j.is_string()) {
        switch (j.get_ref<const string&>().c_str()[0]) {
            case static_cast<char>(Error::Type::DATASTORE):
                t = Error::Type::DATASTORE;
                break;
            case static_cast<char>(Error::Type::GRAPH):
                t = Error::Type::GRAPH;
                break;
            case static_cast<char>(Error::Type::CONTEXT):
                t = Error::Type::CONTEXT;
                break;
            case static_cast<char>(Error::Type::TRANSACTION):
                t = Error::Type::TRANSACTION;
                break;
            case static_cast<char>(Error::Type::SQL):
                t = Error::Type::SQL;
                break;
            default:
                break;
        }
    }
}

void nogdb::to_json(json &j, const Error &e) {
    j = json{{"type", e.type()},
        {"code", e.code()},
        {"what", e.what()}};
}
void nogdb::from_json(const json &j, Error &e) {
    e = Error(j.at("code"), j.at("type"));
}

void nogdb::to_json(json &j, const DBInfo &i) {
    j = json{{"dbPath", i.dbPath},
        {"maxDB", i.maxDB},
        {"maxDBSize", i.maxDBSize},
        {"maxPropertyId", i.maxPropertyId},
        {"numProperty", i.numProperty},
        {"maxClassId", i.maxClassId},
        {"numClass", i.numClass},
        {"maxIndexId", i.maxIndexId},
        {"numIndex", i.numIndex}};
}
void nogdb::from_json(const json &j, DBInfo &i) {
    i = DBInfo();
    i.dbPath = j.at("dbPath");
    i.maxDB = j.at("maxDB");
    i.maxDBSize = j.at("maxDBSize");
    i.maxPropertyId = j.at("maxPropertyId");
    i.numProperty = j.at("numProperty");
    i.maxClassId = j.at("maxClassId");
    i.numClass = j.at("numClass");
    i.maxIndexId = j.at("maxIndexId");
    i.numIndex = j.at("numIndex");
}

void nogdb::to_json(json &j, const PropertyType &t) {
    j = string(1, static_cast<char>(t));
}
void nogdb::from_json(const json &j, PropertyType &t) {
    if (j.is_string()) {
        switch (j.get_ref<const string&>().c_str()[0]) {
            case static_cast<char>(PropertyType::TINYINT):
                t = PropertyType::TINYINT;
                break;
            case static_cast<char>(PropertyType::UNSIGNED_TINYINT):
                t = PropertyType::UNSIGNED_TINYINT;
                break;
            case static_cast<char>(PropertyType::SMALLINT):
                t = PropertyType::SMALLINT;
                break;
            case static_cast<char>(PropertyType::UNSIGNED_SMALLINT):
                t = PropertyType::UNSIGNED_SMALLINT;
                break;
            case static_cast<char>(PropertyType::INTEGER):
                t = PropertyType::INTEGER;
                break;
            case static_cast<char>(PropertyType::UNSIGNED_INTEGER):
                t = PropertyType::UNSIGNED_INTEGER;
                break;
            case static_cast<char>(PropertyType::BIGINT):
                t = PropertyType::BIGINT;
                break;
            case static_cast<char>(PropertyType::UNSIGNED_BIGINT):
                t = PropertyType::UNSIGNED_BIGINT;
                break;
            case static_cast<char>(PropertyType::TEXT):
                t = PropertyType::TEXT;
                break;
            case static_cast<char>(PropertyType::REAL):
                t = PropertyType::REAL;
                break;
            case static_cast<char>(PropertyType::BLOB):
                t = PropertyType::BLOB;
                break;
            default:
                t = PropertyType::UNDEFINED;
                break;
        }
    } else {
        t = PropertyType::UNDEFINED;
    }
}

void nogdb::to_json(json &j, const PropertyDescriptor &p) {
    j = json{{"id", p.id},
        {"type", p.type},
        {"indexInfo", p.indexInfo}};
}
void nogdb::from_json(const json &j, PropertyDescriptor &p) {
    p = PropertyDescriptor(j.at("id"),
                           j.at("type"),
                           j.at("indexInfo").get<IndexInfo>());
}

void nogdb::to_json(json &j, const ClassType &t) {
    j = string(1, static_cast<char>(t));
}
void nogdb::from_json(const json &j, ClassType &t) {
    if (j.is_string()) {
        switch (j.get_ref<const string&>().c_str()[0]) {
            case static_cast<char>(ClassType::VERTEX):
                t = ClassType::VERTEX;
                break;
            case static_cast<char>(ClassType::EDGE):
                t = ClassType::EDGE;
                break;
            default:
                t = ClassType::UNDEFINED;
                break;
        }
    } else {
        t = ClassType::UNDEFINED;
    }
}

void nogdb::to_json(json &j, const ClassDescriptor &c) {
    j = json{{"id", c.id},
        {"name", c.name},
        {"type", c.type},
        {"properties", c.properties},
        {"super", c.super},
        {"sub", c.sub}};
}
void nogdb::from_json(const json &j, ClassDescriptor &c) {
    c = ClassDescriptor(j.at("id"),
                        j.at("name"),
                        j.at("type"),
                        j.at("properties").get<ClassProperty>(),
                        j.at("super"),
                        j.at("sub").get<vector<string>>());
}

void nogdb::to_json(json &j, const RecordDescriptor &r) {
    j = json{{"rid", r.rid}};
}
void nogdb::from_json(const json &j, RecordDescriptor &r) {
    r = RecordDescriptor(j.at("rid").get<RecordId>());
}

void nogdb::to_json(json &j, const Bytes &b) {
    static char hexmap[] = {'0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

    const unsigned char *raw = b.getRaw();
    size_t size = b.size();
    auto hex = string(size * 2, '\0');
    for (size_t i = 0; i < size; i++) {
        hex[i * 2] = hexmap[(raw[i] & 0xF0) >> 4];
        hex[i * 2 + 1] = hexmap[raw[i] & 0x0F];
    }
    j = string("X'") + hex + "'";
}
void nogdb::from_json(const json &j, Bytes &b) {
    /*
     ** Translate a single byte of Hex into an integer.
     ** This routine only works if h really is a valid hexadecimal
     ** character:  0..9a..fA..F
     */
    static auto hexToInt = [](int h){ return (uint8_t) ((h + 9 * (1 & (h >> 6))) & 0xf); };

    if (j.is_string()) {
        auto str = j.get<string>();

        // json is string and format X'hhh' or x'hhh'
        if ((str[0] == 'X' || str[0] == 'x')
            && str[1] == '\''
            && str.back() == '\'')
        {
            auto hex = str.c_str() + 2;
            auto hexSize = str.size() - 3; // remove X and two quote.
            auto blobSize = hexSize / 2 + 1;
            auto blob = new unsigned char[blobSize];
            size_t i;
            for (i = 0; i < hexSize - 1; i += 2) {
                blob[i / 2] = (hexToInt(hex[i]) << 4) | hexToInt(hex[i + 1]);
            }
            blob[i / 2] = 0;
            b = Bytes(blob, hexSize / 2);
            delete[] blob;
        } else {
            b = Bytes(str);
        }
    } else if (j.is_number()) {
        if (j.is_number_unsigned()) {
            b = Bytes(j.get<unsigned int>());
        } else if (j.is_number_integer()) {
            b = Bytes(j.get<int>());
        } else if (j.is_number_float()) {
            b = Bytes(j.get<double>());
        } else {
            assert(false);
        }
    }
}
void nogdb::to_json(json &j, const Bytes &b, const PropertyType &t) {
    switch (t) {
        case PropertyType::TINYINT:
            j = b.toTinyInt();
            break;
        case PropertyType::UNSIGNED_TINYINT:
            j = b.toTinyIntU();
            break;
        case PropertyType::SMALLINT:
            j = b.toSmallInt();
            break;
        case PropertyType::UNSIGNED_SMALLINT:
            j = b.toSmallIntU();
            break;
        case PropertyType::INTEGER:
            j = b.toInt();
            break;
        case PropertyType::UNSIGNED_INTEGER:
            j = b.toIntU();
            break;
        case PropertyType::BIGINT:
            j = b.toBigInt();
            break;
        case PropertyType::UNSIGNED_BIGINT:
            j = b.toBigIntU();
            break;
        case PropertyType::TEXT:
            j = b.toText();
            break;
        case PropertyType::REAL:
            j = b.toReal();
            break;
        case PropertyType::BLOB:
        case PropertyType::UNDEFINED:
        default:
            to_json(j, b);
            break;
    }
}
void nogdb::from_json(const json &j, Bytes &b, const PropertyType &t) {
    switch (t) {
        case PropertyType::TINYINT:
            if (j.is_number_integer()) {
                auto tmp = j.get<int8_t>();
                b = Bytes(tmp);
            }
            break;
        case PropertyType::UNSIGNED_TINYINT:
            if (j.is_number_unsigned()) {
                b = Bytes(j.get<uint8_t>());
            }
            break;
        case PropertyType::SMALLINT:
            if (j.is_number_integer()) {
                b = Bytes(j.get<int16_t>());
            }
            break;
        case PropertyType::UNSIGNED_SMALLINT:
            if (j.is_number_unsigned()) {
                b = Bytes(j.get<uint16_t>());
            }
            break;
        case PropertyType::INTEGER:
            if (j.is_number_integer()) {
                b = Bytes(j.get<int32_t>());
            }
            break;
        case PropertyType::UNSIGNED_INTEGER:
            if (j.is_number_unsigned()) {
                b = Bytes(j.get<uint32_t>());
            }
            break;
        case PropertyType::BIGINT:
            if (j.is_number_integer()) {
                b = Bytes(j.get<int64_t>());
            }
            break;
        case PropertyType::UNSIGNED_BIGINT:
            if (j.is_number_unsigned()) {
                b = Bytes(j.get<uint64_t>());
            }
            break;
        case PropertyType::TEXT:
            if (j.is_string()) {
                b = Bytes(j.get<string>());
            }
            break;
        case PropertyType::REAL:
            if (j.is_number_float()) {
                b = Bytes(j.get<double>());
            }
            break;
        case PropertyType::BLOB:
        case PropertyType::UNDEFINED:
        default:
            if (j.is_string()) {
                from_json(j, b);
            }
            break;
    }
}

void nogdb::to_json(json &j, const Record &r, const ClassDescriptor &schema) {
    j.clear();
    for (const auto &p: r.getAll()) {
        PropertyType type{};
        try {
            type = schema.properties.at(p.first).type;
        } catch (...) {
            if (p.first == "@className") {
                type = PropertyType::TEXT;
            } else if (p.first == "@recordId") {
                type = PropertyType::TEXT;
            } else if (p.first == "@version") {
                type = PropertyType::UNSIGNED_BIGINT;
            } else if (p.first == "@depth") {
                type = PropertyType::UNSIGNED_INTEGER;
            } else {
                type = PropertyType::UNDEFINED;
            }
        }
        to_json(j[p.first], p.second, type);
    }
}
void nogdb::from_json(const json &j, Record &r, const ClassDescriptor &schema) {
    for (auto it = j.cbegin(); it != j.cend(); ++it) {
        PropertyType type{};
        Bytes b{};
        try {
            type = schema.properties.at(it.key()).type;
        } catch (...) {
            type = PropertyType::UNDEFINED;
        }
        from_json(it.value(), b, type);
        r.set(it.key(), static_cast<const Bytes&>(b));
    }
}

void nogdb::to_json(json &j, const Result &rs, const vector<ClassDescriptor> &schemas) {
    auto scIt = find_if(schemas.cbegin(),
                   schemas.cend(),
                   [&rs](const ClassDescriptor &c){
                       return rs.descriptor.rid.first == c.id;
                   });
    if (scIt != schemas.cend()) {
        to_json(j, rs, *scIt);
    } else {
        to_json(j, rs);
    }
}
void nogdb::from_json(const json &j, Result &rs, const vector<ClassDescriptor> &schemas) {
    auto scIt = find_if(schemas.cbegin(),
                        schemas.cend(),
                        [&j](const ClassDescriptor &c){
                            return j.at("descriptor").at("rid").at(0) == c.id;
                        });
    if (scIt != schemas.cend()) {
        from_json(j, rs, *scIt);
    } else {
        from_json(j, rs);
    }
}
void nogdb::to_json(json &j, const Result &rs, const ClassDescriptor &schema) {
    j = json{{"descriptor", rs.descriptor}};
    to_json(j["record"], rs.record, schema);
}
void nogdb::from_json(const json &j, Result &rs, const ClassDescriptor &schema) {
    Record r{};
    from_json(j.at("record"), r, schema);
    rs = Result(j.at("descriptor"), r);
}

void nogdb::to_json(json &j, const SQL::Result::Type &t) {
    switch (t) {
        case SQL::Result::NO_RESULT:
            j = json("n");
            break;
        case SQL::Result::ERROR:
            j = json("e");
            break;
        case SQL::Result::CLASS_DESCRIPTOR:
            j = json("c");
            break;
        case SQL::Result::PROPERTY_DESCRIPTOR:
            j = json("p");
            break;
        case SQL::Result::RECORD_DESCRIPTORS:
            j = json("r");
            break;
        case SQL::Result::RESULT_SET:
            j = json("s");
            break;
        default:
            assert(false);
            break;
    }
}
void nogdb::from_json(const json &j, SQL::Result::Type &t) {
    if (j.is_string()) {
        switch (j.get_ref<const string&>().c_str()[0]) {
            case 'n':
                t = SQL::Result::NO_RESULT;
                break;
            case 'e':
                t = SQL::Result::ERROR;
                break;
            case 'c':
                t = SQL::Result::CLASS_DESCRIPTOR;
                break;
            case 'p':
                t = SQL::Result::PROPERTY_DESCRIPTOR;
                break;
            case 'r':
                t = SQL::Result::RECORD_DESCRIPTORS;
                break;
            case 's':
                t = SQL::Result::RESULT_SET;
                break;
            default:
                t = SQL::Result::NO_RESULT;
                break;
        }
    } else {
        t = SQL::Result::NO_RESULT;
    }
}

void nogdb::to_json(json &j, const SQL::Result &rs, const vector<ClassDescriptor> &schemas) {
    j = json{{"type", rs.type()}, {"data", nullptr}};
    switch (rs.type()) {
        case SQL::Result::NO_RESULT:
            break;
        case SQL::Result::ERROR:
            j["data"] = rs.get<Error>();
            break;
        case SQL::Result::CLASS_DESCRIPTOR:
            j["data"] = rs.get<ClassDescriptor>();
            break;
        case SQL::Result::PROPERTY_DESCRIPTOR:
            j["data"] = rs.get<PropertyDescriptor>();
            break;
        case SQL::Result::RECORD_DESCRIPTORS:
            j["data"] = rs.get<vector<RecordDescriptor>>();
            break;
        case SQL::Result::RESULT_SET:
            for (const auto &r: rs.get<ResultSet>()) {
                json jR;
                to_json(jR, r, schemas);
                j["data"].push_back(move(jR));
            }
            break;
        default:
            assert(false);
            break;
    }
}

void nogdb::to_json(json &j, const Txn::Mode &m) {
    switch (m) {
        case Txn::Mode::READ_ONLY:
            j = json("READ_ONLY");
            break;
        case Txn::Mode::READ_WRITE:
            j = json("READ_WRITE");
            break;
        default:
            assert(false);
            break;
    }
}
void nogdb::from_json(const json &j, Txn::Mode &m) {
    assert(j.is_string());
    if (j == "READ_ONLY") {
        m = Txn::Mode::READ_ONLY;
    } else if (j == "READ_WRITE") {
        m = Txn::Mode::READ_WRITE;
    } else {
        assert(false);
    }
}


void std::to_json(json &j, const IndexInfo &ii) {
    j.clear();
    for (const auto &i: ii) {
        j[to_string(i.first)] = i.second;
    }
}
void std::from_json(const json &j, IndexInfo &ii) {
    ii.clear();
    for (auto it = j.cbegin(); it != j.cend(); ++it) {
        ii[stoi(it.key())] = make_pair(it.value().at(0), it.value().at(1));
    }
}
