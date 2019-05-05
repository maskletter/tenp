"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
var router_1 = require("./lib/router");
exports.dbRouterInfo = router_1.dbRouterInfo;
exports.Router = router_1.Router;
exports.Config = router_1.Config;
exports.Get = router_1.Get;
exports.Post = router_1.Post;
exports.Delete = router_1.Delete;
exports.Put = router_1.Put;
exports.Head = router_1.Head;
var consoller_1 = require("./lib/consoller");
exports.Controller = consoller_1.Controller;
exports.createController = consoller_1.createController;
var server_1 = require("./lib/server");
exports.Start = server_1.default;
var injector_plugin_1 = require("./lib/plugin/injector.plugin");
exports.Injector = injector_plugin_1.Injector;
var RouterComponent = /** @class */ (function () {
    function RouterComponent() {
    }
    return RouterComponent;
}());
exports.RouterComponent = RouterComponent;
exports.default = interface_1.default;
