"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockSend = void 0;
var assumeRoleCredentialsProvider_1 = require("./assumeRoleCredentialsProvider");
var client_sts_1 = require("@aws-sdk/client-sts");
jest.mock("@aws-sdk/client-sts");
var mockSTSSend;
var oneHourMs = 1000 * 60 * 60;
beforeAll(function () {
    process.env.AWS_REGION = "eu-central-1";
    jest.useFakeTimers("modern");
});
afterAll(function () {
    jest.useRealTimers();
});
beforeEach(function () {
    mockSTSSend = exports.mockSend(client_sts_1.STSClient);
    mockSTSSend.mockImplementation(function (command) {
        if (command instanceof client_sts_1.AssumeRoleCommand) {
            var expiration = new Date();
            expiration.setHours(expiration.getHours() + 1);
            return {
                Credentials: {
                    AccessKeyId: "MOCK_ACCESS_KEY_ID",
                    SecretAccessKey: "MOCK_SECRET_ACCESS_KEY",
                    SessionToken: "MOCK_SESSION_TOKEN",
                    Expiration: expiration,
                },
            };
        }
    });
});
it("returns credentials from assumed role", function () { return __awaiter(void 0, void 0, void 0, function () {
    var provider, credentials;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                provider = new assumeRoleCredentialsProvider_1.AssumeRoleCredentialsProvider({
                    roleArn: "arn:aws:iam::111111111111:role/MockRole",
                    region: "eu-west-1",
                });
                return [4 /*yield*/, provider.getCredentials()];
            case 1:
                credentials = _a.sent();
                expect(credentials).toStrictEqual({
                    accessKeyId: "MOCK_ACCESS_KEY_ID",
                    secretAccessKey: "MOCK_SECRET_ACCESS_KEY",
                    sessionToken: "MOCK_SESSION_TOKEN",
                });
                return [2 /*return*/];
        }
    });
}); });
it("uses provided region", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        new assumeRoleCredentialsProvider_1.AssumeRoleCredentialsProvider({
            roleArn: "arn:aws:iam::111111111111:role/MockRole",
            region: "eu-west-1",
        });
        expect(client_sts_1.STSClient).toBeCalledWith({ region: "eu-west-1" });
        return [2 /*return*/];
    });
}); });
it("uses region from env if not provided", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        new assumeRoleCredentialsProvider_1.AssumeRoleCredentialsProvider({
            roleArn: "arn:aws:iam::111111111111:role/MockRole",
        });
        expect(client_sts_1.STSClient).toBeCalledWith({ region: "eu-central-1" });
        return [2 /*return*/];
    });
}); });
it("does not assume role again with active credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
    var provider;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                provider = new assumeRoleCredentialsProvider_1.AssumeRoleCredentialsProvider({
                    roleArn: "arn:aws:iam::111111111111:role/MockRole",
                });
                return [4 /*yield*/, provider.getCredentials()];
            case 1:
                _a.sent();
                return [4 /*yield*/, provider.getCredentials()];
            case 2:
                _a.sent();
                expect(mockSTSSend).toBeCalledTimes(1);
                return [2 /*return*/];
        }
    });
}); });
it("assumes role again when credentials expired", function () { return __awaiter(void 0, void 0, void 0, function () {
    var provider;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                provider = new assumeRoleCredentialsProvider_1.AssumeRoleCredentialsProvider({
                    roleArn: "arn:aws:iam::111111111111:role/MockRole",
                    expirationMarginSec: 5,
                });
                return [4 /*yield*/, provider.getCredentials()];
            case 1:
                _a.sent();
                jest.advanceTimersByTime(oneHourMs);
                return [4 /*yield*/, provider.getCredentials()];
            case 2:
                _a.sent();
                expect(mockSTSSend).toBeCalledTimes(2);
                return [2 /*return*/];
        }
    });
}); });
it("assumes role again in credentials expiration margin", function () { return __awaiter(void 0, void 0, void 0, function () {
    var provider;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                provider = new assumeRoleCredentialsProvider_1.AssumeRoleCredentialsProvider({
                    roleArn: "arn:aws:iam::111111111111:role/MockRole",
                    expirationMarginSec: 15,
                });
                return [4 /*yield*/, provider.getCredentials()];
            case 1:
                _a.sent();
                jest.advanceTimersByTime(oneHourMs - 1000 * 10);
                return [4 /*yield*/, provider.getCredentials()];
            case 2:
                _a.sent();
                expect(mockSTSSend).toBeCalledTimes(2);
                return [2 /*return*/];
        }
    });
}); });
var mockSend = function (client) {
    var mock = jest.fn();
    client.mockImplementation(function () { return ({
        send: mock,
    }); });
    return mock;
};
exports.mockSend = mockSend;
