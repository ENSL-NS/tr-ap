"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCredentialsProvider = void 0;
var SimpleCredentialsProvider = /** @class */ (function () {
    function SimpleCredentialsProvider(credentials) {
        this.credentials = credentials;
    }
    SimpleCredentialsProvider.prototype.getCredentials = function () {
        return Promise.resolve(this.credentials);
    };
    return SimpleCredentialsProvider;
}());
exports.SimpleCredentialsProvider = SimpleCredentialsProvider;
