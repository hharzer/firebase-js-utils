"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var document_wrapper_1 = require("./document-wrapper");
var TransactionWrapper = /** @class */ (function () {
    function TransactionWrapper(transaction) {
        this.transaction = transaction;
    }
    TransactionWrapper.prototype.mutate = function (query) {
        return new TransactionWrapper(this.transaction);
    };
    TransactionWrapper.prototype.delete = function (documentRef) {
        var doc = documentRef;
        if (documentRef instanceof document_wrapper_1.DocumentWrapper) {
            doc = documentRef.ref;
        }
        this.transaction.delete(doc);
        return this;
    };
    TransactionWrapper.prototype.get = function (documentRef) {
        var doc = documentRef;
        if (documentRef instanceof document_wrapper_1.DocumentWrapper) {
            doc = documentRef.ref;
        }
        return this.transaction.get(doc);
    };
    TransactionWrapper.prototype.set = function (documentRef, data, options) {
        var doc = documentRef;
        if (documentRef instanceof document_wrapper_1.DocumentWrapper) {
            doc = documentRef.ref;
        }
        this.transaction.set(doc, data, options);
        return this;
    };
    TransactionWrapper.prototype.update = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var doc = args[0];
        if (doc instanceof document_wrapper_1.DocumentWrapper) {
            args[0] = doc.ref;
        }
        this.transaction.update.call(this.transaction, args);
        return this;
    };
    return TransactionWrapper;
}());
exports.TransactionWrapper = TransactionWrapper;
//# sourceMappingURL=transaction-wrapper.js.map