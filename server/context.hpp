
#include <nogdb/nogdb.h>

namespace nogdb {
    namespace server {
        class Context : public nogdb::Context {
        public:
            using nogdb::Context::Context;

            Txn& getTxn(TxnId id);
            void setTxn(Txn &txn);

        private:
            std::map<TxnId, Txn> txnHolder{};
        };
    }
}
