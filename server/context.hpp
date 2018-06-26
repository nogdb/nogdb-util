
#include <nogdb/nogdb.h>

namespace nogdb {
    namespace server {
        class Context : public nogdb::Context {
        public:
            using nogdb::Context::Context;

            Txn& getTxn(TxnId id);
            TxnId setTxn(Txn &&txn);
            void commitTxn(TxnId id);
            void rollbackTxn(TxnId id);

        private:
            std::map<TxnId, Txn> txnHolder{};
        };
    }
}
