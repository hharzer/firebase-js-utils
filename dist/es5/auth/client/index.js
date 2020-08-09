"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserClient = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var AuthUserClient = /** @class */ (function () {
    function AuthUserClient(auth) {
        var _this = this;
        this.auth = auth;
        this.authInitialized = false;
        this.userObservable = new rxjs_1.ReplaySubject(1);
        this.userIdObservable = new rxjs_1.ReplaySubject(1);
        this.auth.onIdTokenChanged(function (user) { return _this.userChanged(user); });
    }
    Object.defineProperty(AuthUserClient.prototype, "user", {
        get: function () {
            return this._user;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AuthUserClient.prototype, "userId", {
        get: function () {
            return this.user && this.user.uid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AuthUserClient.prototype, "userIdToken", {
        get: function () {
            var _a;
            return (_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.getIdToken();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AuthUserClient.prototype, "userIdTokenObservable", {
        get: function () {
            var _this = this;
            return new rxjs_1.Observable(function (subscriber) {
                var unsubscribe = _this.auth.onIdTokenChanged(subscriber);
                return function () { return unsubscribe(); };
            }).pipe(operators_1.switchMap(function (user) { return user.getIdToken(); }));
        },
        enumerable: false,
        configurable: true
    });
    AuthUserClient.prototype.userChanged = function (user) {
        var changed = !this.authInitialized || (!this._user && !!user) || (this._user && !user) || (this._user && user && this._user.uid !== user.uid);
        this._user = user;
        this.authInitialized = true;
        try {
            if (!user) {
                this.userObservable.next(null);
                this.userIdObservable.next(null);
            }
            else if (changed) {
                this.userObservable.next(this._user ? this._user : null);
                this.userIdObservable.next(this._user ? this._user.uid : null);
            }
        }
        catch (e) {
            this.onAuthError(e);
        }
    };
    AuthUserClient.prototype.onAuthError = function (error) {
        console.error(error);
    };
    AuthUserClient.prototype.initialized = function () {
        if (this.authInitialized) {
            return Promise.resolve(true);
        }
        else {
            return this.userIdObservable.pipe(operators_1.first(), operators_1.map(function (id) { return true; })).toPromise();
        }
    };
    AuthUserClient.prototype.userNotSignedError = function () {
        return new Error("User not signed");
    };
    AuthUserClient.prototype.observeUser = function (assertSigned) {
        var _this = this;
        return this.userObservable.pipe(operators_1.switchMap(function (user) { return user || !assertSigned ? rxjs_1.of(user) : rxjs_1.throwError(_this.userNotSignedError()); }));
    };
    return AuthUserClient;
}());
exports.AuthUserClient = AuthUserClient;
//# sourceMappingURL=index.js.map