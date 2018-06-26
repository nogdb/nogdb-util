
#include <nogdb/nogdb.h>

#include "context.hpp"

using namespace std;
using namespace nogdb;

Txn& server::Context::getTxn(TxnId id) {
    return this->txnHolder.at(id);
}

TxnId server::Context::setTxn(Txn &&txn) {
    auto id = txn.getTxnId();
    this->txnHolder.emplace(txn.getTxnId(), move(txn));
    return id;
}

void server::Context::commitTxn(TxnId id) {
    auto txnIt = this->txnHolder.find(id);
    txnIt->second.commit();
    this->txnHolder.erase(txnIt);
}

void server::Context::rollbackTxn(TxnId id) {
    // Txn auto rollback when de-construct.
    this->txnHolder.erase(id);
}
