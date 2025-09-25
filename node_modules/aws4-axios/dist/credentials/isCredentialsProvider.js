"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCredentialsProvider = void 0;
// type guard
var isCredentialsProvider = function (variableToCheck) { var _a; return ((_a = variableToCheck) === null || _a === void 0 ? void 0 : _a.getCredentials) !== undefined; };
exports.isCredentialsProvider = isCredentialsProvider;
