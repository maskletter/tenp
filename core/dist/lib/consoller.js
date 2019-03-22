"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controllerMap = {};
function getController(name) {
    if (!controllerMap[name]) {
        console.log("\r\n\u001B[31m error  \u63A7\u5236\u5668\u672A\u521B\u5EFA\u001B[39m\r\n");
    }
    return controllerMap[name] || function (req, res) {
        res.send('<h1>404 not Controller</h1>');
    };
}
exports.Controller = function (name, $this, argument) {
    if ($this) {
    }
    else {
        return function (target, propertyKey) {
            var d = require('./router').dbPathInfo;
            d[d.length - 1].callback = getController(name);
        };
    }
};
exports.createController = function (name, callback) {
    controllerMap[name] = callback;
    return callback;
};
