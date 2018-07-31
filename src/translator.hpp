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

#ifndef __NOGDB_UTIL_TRANSLATOR_HPP_INCLUDED__
#define __NOGDB_UTIL_TRANSLATOR_HPP_INCLUDED__

#include <nogdb/nogdb.h>
#include <nlohmann/json.hpp>

namespace nogdb {
    using nlohmann::json;

    /// MARK: - Error::Type
    /* <string> */
    void to_json(json&, const Error::Type&);
    void from_json(const json&, Error::Type&);

    /// MARK: - Error
    /* {
     *  "type": <Error::Type>,
     *  "code": <number>,
     *  "what": <string>
     * }
     */
    void to_json(json&, const Error&);
    void from_json(const json&, Error&);

    /// MARK: - DBInfo
    /* {
     *  "dbPath": <string>,
     *  "maxDB": <number>,
     *  "maxDBSize": <number>,
     *  "maxPropertyId": <number>,
     *  "numProperty": <number>,
     *  "maxClassId": <number>,
     *  "numClass": <number>,
     *  "maxIndexId": <number>,
     *  "numIndex": <number>
     * }
     */
    void to_json(json&, const DBInfo&);
    void from_json(const json&, DBInfo&);

    /// MARK: - PropertyType
    /* <string> */
    void to_json(json&, const PropertyType&);
    void from_json(const json&, PropertyType&);

    /// MARK: - PropertyDescriptor
    /* {
     *  "id": <number>,
     *  "type": <PropertyType>
     *  "indexInfo": <IndexInfo>
     * }
     */
    void to_json(json&, const PropertyDescriptor&);
    void from_json(const json&, PropertyDescriptor&);

    /// MARK: - ClassType
    /* <string> */
    void to_json(json&, const ClassType&);
    void from_json(const json&, ClassType&);

    /// MARK: - ClassDescriptor
    /* {
     *  "id": <number>,
     *  "name": <string>,
     *  "type": <ClassType>,
     *  "properties": {
     *      <string>: <PropertyDescriptor>,
     *      ...
     *  },
     *  "super": <string>,
     *  "sub": <string[]>
     * }
     */
    void to_json(json&, const ClassDescriptor&);
    void from_json(const json&, ClassDescriptor&);

    /// MARK: - RecordDescriptor
    /* {
     *  "rid": <number[2]>
     * }
     */
    void to_json(json&, const RecordDescriptor&);
    void from_json(const json&, RecordDescriptor&);

    /// MARK: - Bytes
    /* <string>|<number> */
    void to_json(json&, const Bytes&);
    void from_json(const json&, Bytes&);
    void to_json(json&, const Bytes&, const PropertyType&);
    void from_json(const json&, Bytes&, const PropertyType&);

    /// MARK: - Record
    /* {
     *  <string>: <Bytes>,
     *  ...
     * }
     */
    void to_json(json&, const Record&, const ClassDescriptor &schema = {});
    void from_json(const json&, Record&, const ClassDescriptor &schema = {});

    /// MARK: - Result
    /* {
     *  "descriptor": <RecordDescriptor>,
     *  "record": <Record>
     * }
     */
    void to_json(json&, const Result&, const std::vector<ClassDescriptor>&);
    void from_json(const json&, Result&, const std::vector<ClassDescriptor>&);
    void to_json(json&, const Result&, const ClassDescriptor &schema = {});
    void from_json(const json&, Result&, const ClassDescriptor &schema = {});

    /// MARK: - SQL::Result::Type
    /* <string> */
    void to_json(json&, const SQL::Result::Type&);
    void from_json(const json&, SQL::Result::Type&);

    /// MARK: - SQL::Result
    /* {
     *  "type": <SQL::Result::Type>
     *
     *  // relate on type
     *  "data":
     *      null
     *      | <Error>
     *      | <ClassDescriptor>
     *      | <PropertyDescriptor>
     *      | <RecordDescriptor[]>
     *      | <Result[]>
     * }
     */
    void to_json(json&, const SQL::Result&, const std::vector<ClassDescriptor> &schema = {});

    /// MARK: - Txn::Mode
    /* "READ_ONLY"|"READ_WRITE" */
    void to_json(json&, const Txn::Mode&);
    void from_json(const json&, Txn::Mode&);

    /// MARK: - Condition
    // Can not translate from json to Condition because it hasn't default constructor.
    /* {
     *  "propName": <string>,
     *  "comp": <string>,
     *
     *  // relate on compatator
     *  "value":
     *      <string>
     *      |<Bytes>
     *      |<Bytes[]>
     *      |null
     *
     *  // optional
     *  "ignoreCase": <bool>
     * }
     */
    //void from_json(const json&, Condition&);

    /// MARK: - ClassFilter
    /* <string[]> */
    void from_json(const json&, ClassFilter&);
    void to_json(json&, const ClassFilter&);
}

namespace std {
    /// MARK: - IndexInfo
    /* {
     *  <string>: [ <number>, <bool> ],
     *  ...
     * }
     */
    void to_json(nlohmann::json&, const nogdb::IndexInfo&);
    void from_json(const nlohmann::json&, nogdb::IndexInfo&);
}

#endif
