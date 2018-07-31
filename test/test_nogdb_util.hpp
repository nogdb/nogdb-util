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

#ifndef __NOGDB_UTIL_TEST_NOGDB_UTIL_HPP_INCLUDED__
#define __NOGDB_UTIL_TEST_NOGDB_UTIL_HPP_INCLUDED__

#include <nogdb/nogdb.h>

namespace nogdb {
    inline bool operator==(const DBInfo &lhs, const DBInfo &rhs) {
        return (lhs.dbPath == rhs.dbPath
                && lhs.maxDB == rhs.maxDB
                && lhs.maxDBSize == rhs.maxDBSize
                && lhs.maxPropertyId == rhs.maxPropertyId
                && lhs.numProperty == rhs.numProperty
                && lhs.maxClassId == rhs.maxClassId
                && lhs.numClass == rhs.numClass
                && lhs.maxIndexId == rhs.maxIndexId
                && lhs.numIndex == rhs.numIndex);
    }

    inline bool operator==(const PropertyDescriptor &lhs, const PropertyDescriptor &rhs) {
        return (lhs.id == rhs.id
                && lhs.type == rhs.type
                && lhs.indexInfo == rhs.indexInfo);
    }

    inline bool operator==(const ClassDescriptor &lhs, const ClassDescriptor &rhs) {
        return (lhs.id == rhs.id
                && lhs.name == rhs.name
                && lhs.type == rhs.type
                && lhs.properties == rhs.properties
                && lhs.super == rhs.super
                && lhs.sub == rhs.sub);
    }

    inline bool operator==(const Bytes &lhs, const Bytes &rhs) {
        return lhs.size() == rhs.size() && memcmp(lhs.getRaw(), rhs.getRaw(), lhs.size()) == 0;
    }

    inline bool operator==(const Record &lhs, const Record &rhs) {
        return lhs.getAll() == rhs.getAll() && lhs.getBasicInfo() == rhs.getBasicInfo();
    }

    inline bool operator==(const Result &lhs, const Result &rhs) {
        return lhs.descriptor == rhs.descriptor && lhs.record == rhs.record;
    }
}

#endif
