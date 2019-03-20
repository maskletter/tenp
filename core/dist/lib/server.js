"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var https = require("https");
var http = require("http");
var express_1 = require("./express");
var router_1 = require("./router");
var event_1 = require("./event");
//Create an express service
function createExpressServer(config) {
    var app = express_1.default({});
    var httpServer = http.createServer(app).listen(config.port);
    if (config.https) {
        var httpsServer = https.createServer(config.https, app).listen(config.port);
    }
    return app;
}
//Create an router service
function createRouterServer(config, routerMap, app) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, routerMap_1, Class, Router, classInfo, $class;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, routerMap_1 = routerMap;
                    _a.label = 1;
                case 1:
                    if (!(_i < routerMap_1.length)) return [3 /*break*/, 6];
                    Class = routerMap_1[_i];
                    Router = Class.class ? Class.class : Class;
                    classInfo = router_1.dbRouterInfo[Router.$$id];
                    $class = new classInfo.functoin();
                    //Run the router initialization event
                    return [4 /*yield*/, event_1.InitRouterEvent(config, classInfo.config, event_1.GetParentConfig(Router.$$parentId))];
                case 2:
                    //Run the router initialization event
                    _a.sent();
                    //Run createInterfaceServer
                    return [4 /*yield*/, createInterfaceServer(config, classInfo, $class, app)];
                case 3:
                    //Run createInterfaceServer
                    _a.sent();
                    if (!classInfo.config.router) return [3 /*break*/, 5];
                    return [4 /*yield*/, createRouterServer(config, classInfo.config.router, app)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
//Create an interface service
function createInterfaceServer(config, classInfo, $class, app) {
    return __awaiter(this, void 0, void 0, function () {
        var pathMap;
        var _this = this;
        return __generator(this, function (_a) {
            pathMap = classInfo.path || [];
            pathMap.forEach(function (data) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, event_1.InitInterfaceEvent(data.config, config)];
                        case 1:
                            _a.sent();
                            //Register for an express interface event
                            app[data.config.type](data.config.url, function (request, response) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var result;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, event_1.AfterInterfaceEvent(data.config, config, request, response)];
                                            case 1:
                                                result = _a.sent();
                                                if (result != false) {
                                                    data.callback.apply($class, [request, response]);
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
exports.default = (function (config, app) { return __awaiter(_this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!app) {
                    app = createExpressServer(config);
                }
                _a = config;
                return [4 /*yield*/, event_1.InitTenpEvent(config)];
            case 1:
                _a.plugin = _b.sent();
                return [4 /*yield*/, createRouterServer(config, config.router, app)];
            case 2:
                _b.sent();
                return [2 /*return*/, app];
        }
    });
}); });
