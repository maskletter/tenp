"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./lib/router");
exports.Router = router_1.Router;
exports.Config = router_1.Config;
exports.Get = router_1.Get;
exports.Post = router_1.Post;
exports.Delete = router_1.Delete;
exports.Put = router_1.Put;
exports.Head = router_1.Head;
var server_1 = require("./lib/server");
exports.Start = server_1.default;
function tenp() {
}
exports.default = tenp;
