"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./lib/router");
exports.dbRouterInfo = router_1.dbRouterInfo;
exports.Router = router_1.Router;
exports.Config = router_1.Config;
exports.Get = router_1.Get;
exports.Post = router_1.Post;
exports.Delete = router_1.Delete;
exports.Put = router_1.Put;
exports.Head = router_1.Head;
var server_1 = require("./lib/server");
exports.Start = server_1.default;
var injector_plugin_1 = require("./lib/plugin/injector.plugin");
exports.Injector = injector_plugin_1.Injector;
var consoller_1 = require("./lib/consoller");
exports.Controller = consoller_1.Controller;
exports.createController = consoller_1.createController;
var common_plugin_1 = require("./lib/plugin/common.plugin");
exports.Global = common_plugin_1.Global;
exports.getGlobal = common_plugin_1.getGlobal;
function tenp() {
}
var RouterComponent = /** @class */ (function () {
    function RouterComponent() {
    }
    return RouterComponent;
}());
exports.RouterComponent = RouterComponent;
exports.default = tenp;
