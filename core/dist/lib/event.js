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
var url_plugin_1 = require("./plugin/url.plugin");
var interceptor_plugin_1 = require("./plugin/interceptor.plugin");
var router_1 = require("./router");
//Get the parent configuration
exports.GetParentConfig = function (parentId) {
    if (parentId && router_1.dbRouterInfo[parentId]) {
        return router_1.dbRouterInfo[parentId].config;
    }
    else {
        return {};
    }
};
//Initialize the tenp event
exports.InitTenpEvent = function (config) { return __awaiter(_this, void 0, void 0, function () {
    var pluginMap, pluginS, _i, pluginMap_1, Plugin_1, plugin, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pluginMap = [url_plugin_1.default, interceptor_plugin_1.default].concat((config.plugin || []));
                pluginS = [];
                _i = 0, pluginMap_1 = pluginMap;
                _b.label = 1;
            case 1:
                if (!(_i < pluginMap_1.length)) return [3 /*break*/, 5];
                Plugin_1 = pluginMap_1[_i];
                plugin = new Plugin_1();
                _a = plugin.onTenp;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, plugin.onTenp(config)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                _a;
                pluginS.push(plugin);
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, pluginS];
        }
    });
}); };
//Initialize routing events
exports.InitRouterEvent = function (config, routerConfig, parentConfig) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, plugin, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _i = 0, _a = config.plugin;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                plugin = _a[_i];
                _b = plugin.onRouter;
                if (!_b) return [3 /*break*/, 3];
                return [4 /*yield*/, plugin.onRouter(routerConfig, parentConfig, config)];
            case 2:
                _b = (_c.sent());
                _c.label = 3;
            case 3:
                _b;
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
//Initialize interface events
exports.InitInterfaceEvent = function (pathConfig, config) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, plugin, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _i = 0, _a = config.plugin;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                plugin = _a[_i];
                _b = plugin.onInit;
                if (!_b) return [3 /*break*/, 3];
                return [4 /*yield*/, plugin.onInit(pathConfig, config)];
            case 2:
                _b = (_c.sent());
                _c.label = 3;
            case 3:
                _b;
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.AfterInterfaceEvent = function (pathConfig, config, request, response) { return __awaiter(_this, void 0, void 0, function () {
    var _i, _a, plugin, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _i = 0, _a = config.plugin;
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                plugin = _a[_i];
                if (!plugin.onAfter) return [3 /*break*/, 3];
                return [4 /*yield*/, plugin.onAfter(pathConfig, config, request, response)];
            case 2:
                result = _b.sent();
                if (result == false) {
                    return [2 /*return*/, false];
                    return [3 /*break*/, 4];
                }
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
