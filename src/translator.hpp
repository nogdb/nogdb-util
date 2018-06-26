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

namespace nogdb {
    using nlohmann::json;

    void to_json(json&, const Error::Type&);
    void from_json(const json&, Error::Type&);

    void to_json(json&, const Error&);
    void from_json(const json&, Error&);

    void to_json(json&, const DBInfo&);
    void from_json(const json&, DBInfo&);

    void to_json(json&, const PropertyType&);
    void from_json(const json&, PropertyType&);

    void to_json(json&, const PropertyDescriptor&);
    void from_json(const json&, PropertyDescriptor&);

    void to_json(json&, const ClassType&);
    void from_json(const json&, ClassType&);

    void to_json(json&, const ClassDescriptor&);
    void from_json(const json&, ClassDescriptor&);

    void to_json(json&, const RecordDescriptor&);
    void from_json(const json&, RecordDescriptor&);

    void to_json(json&, const Bytes&);
    void from_json(const json&, Bytes&);
    void to_json(json&, const Bytes&, const PropertyType&);
    void from_json(const json&, Bytes&, const PropertyType&);

    void to_json(json&, const Record&, const ClassDescriptor &schema = {});
    void from_json(const json&, Record&, const ClassDescriptor &schema = {});

    void to_json(json&, const Result&, const std::vector<ClassDescriptor>&);
    void from_json(const json&, Result&, const std::vector<ClassDescriptor>&);
    void to_json(json&, const Result&, const ClassDescriptor &schema = {});
    void from_json(const json&, Result&, const ClassDescriptor &schema = {});

    void to_json(json&, const SQL::Result::Type&);
    void from_json(const json&, SQL::Result::Type&);

    void to_json(json&, const SQL::Result&, const std::vector<ClassDescriptor> &schema = {});
}

namespace std {
    void to_json(nlohmann::json&, const nogdb::IndexInfo&);
    void from_json(const nlohmann::json&, nogdb::IndexInfo&);
}
