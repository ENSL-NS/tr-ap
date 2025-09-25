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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var __1 = require("..");
var client_sts_1 = require("@aws-sdk/client-sts");
var methods = ["GET", "DELETE"];
var dataMethods = ["POST", "PATCH", "PUT"];
var region = process.env.AWS_REGION;
var apiGateway = process.env.API_GATEWAY_URL;
var clientRoleArn = process.env.CLIENT_ROLE_ARN;
var assumedClientRoleArn = process.env.ASSUMED_CLIENT_ROLE_ARN;
var service = "execute-api";
var clientCredentials;
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var sts, credentials;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sts = new client_sts_1.STSClient({ region: region });
                return [4 /*yield*/, sts.send(new client_sts_1.AssumeRoleCommand({
                        RoleArn: clientRoleArn,
                        RoleSessionName: "integration-tests",
                    }))];
            case 1:
                credentials = (_a.sent()).Credentials;
                clientCredentials = {
                    accessKeyId: (credentials === null || credentials === void 0 ? void 0 : credentials.AccessKeyId) || "",
                    secretAccessKey: (credentials === null || credentials === void 0 ? void 0 : credentials.SecretAccessKey) || "",
                    sessionToken: (credentials === null || credentials === void 0 ? void 0 : credentials.SessionToken) || "",
                };
                cleanEnvCredentials();
                return [2 /*return*/];
        }
    });
}); });
var setEnvCredentials = function () {
    process.env.AWS_ACCESS_KEY_ID = clientCredentials === null || clientCredentials === void 0 ? void 0 : clientCredentials.accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = clientCredentials === null || clientCredentials === void 0 ? void 0 : clientCredentials.secretAccessKey;
    process.env.AWS_SESSION_TOKEN = clientCredentials === null || clientCredentials === void 0 ? void 0 : clientCredentials.sessionToken;
};
var cleanEnvCredentials = function () {
    delete process.env.AWS_PROFILE;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_SESSION_TOKEN;
};
describe("check that API is actually protected", function () {
    it.each(__spreadArray(__spreadArray([], methods), dataMethods))("checks that HTTP %s is protected", function (method) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(axios_1.default.request({ url: apiGateway, method: method })).rejects.toMatchObject({
                        response: {
                            status: 403,
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("with credentials from environment variables", function () {
    var client;
    var data = {
        foo: "bar",
    };
    beforeAll(function () {
        setEnvCredentials();
    });
    afterAll(function () {
        cleanEnvCredentials();
    });
    beforeEach(function () {
        client = axios_1.default.create();
        client.interceptors.request.use(__1.aws4Interceptor({ region: region, service: service }));
    });
    it.each(methods)("HTTP %s", function (method) { return __awaiter(void 0, void 0, void 0, function () {
        var error, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request({ url: apiGateway, method: method })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    error = __1.getAuthErrorMessage(err_1);
                    return [3 /*break*/, 3];
                case 3:
                    expect(error).toBe(undefined);
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    expect(result && result.data.requestContext.http.method).toBe(method);
                    expect(result && result.data.requestContext.http.path).toBe("/");
                    return [2 /*return*/];
            }
        });
    }); });
    it.each(dataMethods)("HTTP %s", function (method) { return __awaiter(void 0, void 0, void 0, function () {
        var error, result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request({
                            url: apiGateway,
                            method: method,
                            data: data,
                        })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    error = __1.getAuthErrorMessage(err_2);
                    return [3 /*break*/, 3];
                case 3:
                    expect(error).toBe(undefined);
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    expect(result && result.data.requestContext.http.method).toBe(method);
                    expect(result && result.data.requestContext.http.path).toBe("/");
                    expect(result && JSON.parse(result.data.body)).toStrictEqual(data);
                    return [2 /*return*/];
            }
        });
    }); });
    it("handles path", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, result, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request({
                            url: apiGateway + "/some/path",
                        })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    error = __1.getAuthErrorMessage(err_3);
                    return [3 /*break*/, 3];
                case 3:
                    expect(error).toBe(undefined);
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    expect(result && result.data.requestContext.http.path).toBe("/some/path");
                    return [2 /*return*/];
            }
        });
    }); });
    it("handles query parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, result, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request({
                            url: apiGateway,
                            params: {
                                lorem: 42,
                            },
                        })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    error = __1.getAuthErrorMessage(err_4);
                    return [3 /*break*/, 3];
                case 3:
                    expect(error).toBe(undefined);
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    expect(result && result.data.rawQueryString).toBe("lorem=42");
                    return [2 /*return*/];
            }
        });
    }); });
    it("handles custom headers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, result, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request({
                            url: apiGateway,
                            method: "POST",
                            headers: { "X-Custom-Header": "Baz" },
                            data: data,
                        })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    error = __1.getAuthErrorMessage(err_5);
                    return [3 /*break*/, 3];
                case 3:
                    expect(error).toBe(undefined);
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    expect(result === null || result === void 0 ? void 0 : result.data.headers["x-custom-header"]).toBe("Baz");
                    return [2 /*return*/];
            }
        });
    }); });
    it("handles custom Content-Type header", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, result, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request({
                            url: apiGateway,
                            method: "POST",
                            headers: { "Content-Type": "application/xml" },
                            data: data,
                        })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_6 = _a.sent();
                    error = __1.getAuthErrorMessage(err_6);
                    return [3 /*break*/, 3];
                case 3:
                    expect(error).toBe(undefined);
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    expect(result === null || result === void 0 ? void 0 : result.data.headers["content-type"]).toBe("application/xml");
                    return [2 /*return*/];
            }
        });
    }); });
    it("sets content type as application/json when the body is an object", function () { return __awaiter(void 0, void 0, void 0, function () {
        var error, result, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request({
                            url: apiGateway,
                            method: "POST",
                            data: data,
                        })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_7 = _a.sent();
                    error = __1.getAuthErrorMessage(err_7);
                    return [3 /*break*/, 3];
                case 3:
                    expect(error).toBe(undefined);
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    expect(result === null || result === void 0 ? void 0 : result.data.headers["content-type"]).toBe("application/json");
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("signQuery", function () {
    beforeAll(function () {
        setEnvCredentials();
    });
    afterAll(function () {
        cleanEnvCredentials();
    });
    it("respects signQuery option", function () { return __awaiter(void 0, void 0, void 0, function () {
        var client, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = axios_1.default.create();
                    client.interceptors.request.use(__1.aws4Interceptor({
                        region: region,
                        service: service,
                        signQuery: true,
                    }));
                    return [4 /*yield*/, client.request({
                            url: apiGateway + "/some/path",
                            method: "GET",
                            params: { foo: "bar" },
                        })];
                case 1:
                    result = _a.sent();
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("with role to assume", function () {
    var client;
    var assumedRoleName = assumedClientRoleArn === null || assumedClientRoleArn === void 0 ? void 0 : assumedClientRoleArn.substr(assumedClientRoleArn.indexOf("/") + 1);
    beforeAll(function () {
        setEnvCredentials();
    });
    afterAll(function () {
        cleanEnvCredentials();
    });
    beforeEach(function () {
        client = axios_1.default.create();
        client.interceptors.request.use(__1.aws4Interceptor({ region: region, service: service, assumeRoleArn: assumedClientRoleArn }));
    });
    it.each(__spreadArray(__spreadArray([], methods), dataMethods))("signs HTTP %s request with assumed role credentials", function (method) { return __awaiter(void 0, void 0, void 0, function () {
        var error, result, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.request({ url: apiGateway, method: method })];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_8 = _a.sent();
                    error = __1.getAuthErrorMessage(err_8);
                    return [3 /*break*/, 3];
                case 3:
                    expect(error).toBe(undefined);
                    expect(result === null || result === void 0 ? void 0 : result.status).toEqual(200);
                    expect(result && result.data.requestContext.authorizer.iam.userArn).toContain("/" + assumedRoleName + "/");
                    return [2 /*return*/];
            }
        });
    }); });
});
