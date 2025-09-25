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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aws4Interceptor = void 0;
var aws4_1 = require("aws4");
var buildURL_1 = __importDefault(require("axios/lib/helpers/buildURL"));
var combineURLs_1 = __importDefault(require("axios/lib/helpers/combineURLs"));
var isAbsoluteURL_1 = __importDefault(require("axios/lib/helpers/isAbsoluteURL"));
var simpleCredentialsProvider_1 = require("./credentials/simpleCredentialsProvider");
var assumeRoleCredentialsProvider_1 = require("./credentials/assumeRoleCredentialsProvider");
var isCredentialsProvider_1 = require("./credentials/isCredentialsProvider");
/**
 * Create an interceptor to add to the Axios request chain. This interceptor
 * will sign requests with the AWSv4 signature.
 *
 * @example
 * axios.interceptors.request.use(
 *     aws4Interceptor({ region: "eu-west-2", service: "execute-api" })
 * );
 *
 * @param options The options to be used when signing a request
 * @param credentials Credentials to be used to sign the request
 */
var aws4Interceptor = function (options, credentials) {
    var credentialsProvider;
    if (isCredentialsProvider_1.isCredentialsProvider(credentials)) {
        credentialsProvider = credentials;
    }
    else if ((options === null || options === void 0 ? void 0 : options.assumeRoleArn) && !credentials) {
        credentialsProvider = new assumeRoleCredentialsProvider_1.AssumeRoleCredentialsProvider({
            roleArn: options.assumeRoleArn,
            region: options.region,
            expirationMarginSec: options.assumedRoleExpirationMarginSec,
        });
    }
    else {
        credentialsProvider = new simpleCredentialsProvider_1.SimpleCredentialsProvider(credentials);
    }
    return function (config) { return __awaiter(void 0, void 0, void 0, function () {
        var url, _a, host, pathname, search, data, headers, method, transformRequest, transformedData, _b, common, _delete, get, head, post, put, patch, headersToSign, signingOptions, resolvedCredentials, originalUrl, signedUrl;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!config.url) {
                        throw new Error("No URL present in request config, unable to sign request");
                    }
                    if (config.params) {
                        config.url = buildURL_1.default(config.url, config.params, config.paramsSerializer);
                        delete config.params;
                    }
                    url = config.url;
                    if (config.baseURL && !isAbsoluteURL_1.default(config.url)) {
                        url = combineURLs_1.default(config.baseURL, config.url);
                    }
                    _a = new URL(url), host = _a.host, pathname = _a.pathname, search = _a.search;
                    data = config.data, headers = config.headers, method = config.method;
                    transformRequest = getTransformer(config);
                    transformedData = transformRequest(data, headers);
                    _b = headers, common = _b.common, _delete = _b.delete, get = _b.get, head = _b.head, post = _b.post, put = _b.put, patch = _b.patch, headersToSign = __rest(_b, ["common", "delete", "get", "head", "post", "put", "patch"]);
                    signingOptions = {
                        method: method && method.toUpperCase(),
                        host: host,
                        path: pathname + search,
                        region: options === null || options === void 0 ? void 0 : options.region,
                        service: options === null || options === void 0 ? void 0 : options.service,
                        signQuery: options === null || options === void 0 ? void 0 : options.signQuery,
                        body: transformedData,
                        headers: headersToSign,
                    };
                    return [4 /*yield*/, credentialsProvider.getCredentials()];
                case 1:
                    resolvedCredentials = _c.sent();
                    aws4_1.sign(signingOptions, resolvedCredentials);
                    config.headers = signingOptions.headers;
                    if (signingOptions.signQuery) {
                        originalUrl = new URL(config.url);
                        signedUrl = new URL(originalUrl.origin + signingOptions.path);
                        config.url = signedUrl.toString();
                    }
                    return [2 /*return*/, config];
            }
        });
    }); };
};
exports.aws4Interceptor = aws4Interceptor;
var getTransformer = function (config) {
    var transformRequest = config.transformRequest;
    if (transformRequest) {
        if (typeof transformRequest === "function") {
            return transformRequest;
        }
        else if (transformRequest.length) {
            return transformRequest[0];
        }
    }
    throw new Error("Could not get default transformRequest function from Axios defaults");
};
