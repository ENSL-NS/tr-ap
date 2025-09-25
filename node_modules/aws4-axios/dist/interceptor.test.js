"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws4_1 = require("aws4");
var axios_1 = __importDefault(require("axios"));
var _1 = require(".");
jest.mock("aws4");
jest.mock("./credentials/assumeRoleCredentialsProvider", function () { return ({
    AssumeRoleCredentialsProvider: jest.fn(function () { return ({
        getCredentials: jest.fn().mockResolvedValue({
            accessKeyId: "assumed-access-key-id",
            secretAccessKey: "assumed-secret-access-key",
            sessionToken: "assumed-session-token",
        }),
    }); }),
}); });
var mockCustomProvider = {
    getCredentials: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.resolve({
                    accessKeyId: "custom-provider-access-key-id",
                    secretAccessKey: "custom-provider-secret-access-key",
                    sessionToken: "custom-provider-session-token",
                })];
        });
    }); },
};
var getDefaultHeaders = function () { return ({
// common: { Accept: "application/json, text/plain, */*" },
// delete: {},
// get: {},
// head: {},
// post: { "Content-Type": "application/x-www-form-urlencoded" },
// put: { "Content-Type": "application/x-www-form-urlencoded" },
// patch: { "Content-Type": "application/x-www-form-urlencoded" },
}); };
var getDefaultTransformRequest = function () { return axios_1.default.defaults.transformRequest; };
beforeEach(function () {
    aws4_1.sign.mockReset();
});
describe("interceptor", function () {
    it("signs GET requests", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        method: "GET",
                        url: "https://example.com/foobar",
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        path: "/foobar",
                        method: "GET",
                        region: "local",
                        host: "example.com",
                        headers: {},
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("signs url query paremeters in GET requests", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        method: "GET",
                        url: "https://example.com/foobar?foo=bar",
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        path: "/foobar?foo=bar",
                        method: "GET",
                        region: "local",
                        host: "example.com",
                        headers: {},
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("signs query paremeters in GET requests", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        method: "GET",
                        url: "https://example.com/foobar",
                        params: { foo: "bar" },
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        path: "/foobar?foo=bar",
                        method: "GET",
                        region: "local",
                        host: "example.com",
                        headers: {},
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("signs POST requests with an object payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = { foo: "bar" };
                    request = {
                        method: "POST",
                        url: "https://example.com/foobar",
                        data: data,
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        path: "/foobar",
                        method: "POST",
                        region: "local",
                        host: "example.com",
                        body: '{"foo":"bar"}',
                        headers: { "Content-Type": "application/json" },
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("signs POST requests with a string payload", function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = "foobar";
                    request = {
                        method: "POST",
                        url: "https://example.com/foobar",
                        data: data,
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        method: "POST",
                        path: "/foobar",
                        region: "local",
                        host: "example.com",
                        body: "foobar",
                        headers: {},
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("passes Content-Type header to be signed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = "foobar";
                    request = {
                        method: "POST",
                        url: "https://example.com/foobar",
                        data: data,
                        headers: __assign(__assign({}, getDefaultHeaders()), { "Content-Type": "application/xml" }),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        method: "POST",
                        path: "/foobar",
                        region: "local",
                        host: "example.com",
                        body: "foobar",
                        headers: { "Content-Type": "application/xml" },
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("works with baseURL config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = "foobar";
                    request = {
                        method: "POST",
                        baseURL: "https://example.com/foo",
                        url: "bar",
                        data: data,
                        headers: __assign(__assign({}, getDefaultHeaders()), { "Content-Type": "application/xml" }),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        method: "POST",
                        path: "/foo/bar",
                        region: "local",
                        host: "example.com",
                        body: "foobar",
                        headers: { "Content-Type": "application/xml" },
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    it("passes option to sign the query instead of adding header", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        method: "GET",
                        url: "https://example.com/foobar",
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                        signQuery: true,
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        method: "GET",
                        path: "/foobar",
                        region: "local",
                        host: "example.com",
                        headers: {},
                        signQuery: true,
                    }, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("credentials", function () {
    it("passes provided credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        method: "GET",
                        url: "https://example.com/foobar",
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                    }, {
                        accessKeyId: "access-key-id",
                        secretAccessKey: "secret-access-key",
                        sessionToken: "session-token",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        path: "/foobar",
                        method: "GET",
                        region: "local",
                        host: "example.com",
                        headers: {},
                    }, {
                        accessKeyId: "access-key-id",
                        secretAccessKey: "secret-access-key",
                        sessionToken: "session-token",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("gets credentials for given role", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        method: "GET",
                        url: "https://example.com/foobar",
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                        assumeRoleArn: "arn:aws:iam::111111111111:role/MockRole",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        path: "/foobar",
                        method: "GET",
                        region: "local",
                        host: "example.com",
                        headers: {},
                    }, {
                        accessKeyId: "assumed-access-key-id",
                        secretAccessKey: "assumed-secret-access-key",
                        sessionToken: "assumed-session-token",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("prioritizes provided credentials provider over the role", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        method: "GET",
                        url: "https://example.com/foobar",
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                        assumeRoleArn: "arn:aws:iam::111111111111:role/MockRole",
                    }, mockCustomProvider);
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        path: "/foobar",
                        method: "GET",
                        region: "local",
                        host: "example.com",
                        headers: {},
                    }, {
                        accessKeyId: "custom-provider-access-key-id",
                        secretAccessKey: "custom-provider-secret-access-key",
                        sessionToken: "custom-provider-session-token",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("prioritizes provided credentials over the role", function () { return __awaiter(void 0, void 0, void 0, function () {
        var request, interceptor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {
                        method: "GET",
                        url: "https://example.com/foobar",
                        headers: getDefaultHeaders(),
                        transformRequest: getDefaultTransformRequest(),
                    };
                    interceptor = _1.aws4Interceptor({
                        region: "local",
                        service: "execute-api",
                        assumeRoleArn: "arn:aws:iam::111111111111:role/MockRole",
                    }, {
                        accessKeyId: "access-key-id",
                        secretAccessKey: "secret-access-key",
                        sessionToken: "session-token",
                    });
                    // Act
                    return [4 /*yield*/, interceptor(request)];
                case 1:
                    // Act
                    _a.sent();
                    // Assert
                    expect(aws4_1.sign).toBeCalledWith({
                        service: "execute-api",
                        path: "/foobar",
                        method: "GET",
                        region: "local",
                        host: "example.com",
                        headers: {},
                    }, {
                        accessKeyId: "access-key-id",
                        secretAccessKey: "secret-access-key",
                        sessionToken: "session-token",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
