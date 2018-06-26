
#include <nogdb/nogdb.h>

#include "context.hpp"

using namespace std;
using namespace nogdb;

Txn& server::Context::getTxn(TxnId id) {
    return this->txnHolder.at(id);
}

void server::Context::setTxn(Txn &txn) {
    this->txnHolder.emplace(txn.getTxnId(), move(txn));
}
