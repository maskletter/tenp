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
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
//Store routing information
exports.dbRouterInfo = {};
exports.dbPathInfo = [];
//Routing entry
exports.Router = function (config) {
    if (config === void 0) { config = {}; }
    return function (target) {
        var key = crypto.createHash('md5').update(Math.random() + target.name).digest('hex');
        //If there is a router, set the parentId for the Function in the router.
        if (config.router) {
            config.router.forEach(function (Class) {
                if (Class.data) {
                    Class.class.prototype.$$parentId = key;
                }
                else {
                    Class.prototype.$$parentId = key;
                }
            });
        }
        //Create a router data structure
        exports.dbRouterInfo[key] = {
            id: key,
            name: target.name,
            config: config,
            functoin: target,
            path: exports.dbPathInfo.slice()
        };
        exports.dbPathInfo = [];
        target.prototype.$$id = key;
    };
};
//Interface entry
exports.Config = function (config) {
    //The default is the get method
    config.type || (config.type = 'get');
    //Append to the interface array
    return function (target, propertyKey) {
        exports.dbPathInfo.push({
            config: config,
            callback: target[propertyKey]
        });
    };
};
function forwardMethod(target, propertyKey, method, config) {
    if (typeof (config) == 'string') {
        exports.Config({ type: method, url: config })(target, propertyKey);
    }
    else {
        exports.Config(__assign({ type: method }, config))(target, propertyKey);
    }
}
//Simplify request method
exports.Get = function (config) {
    return function (target, propertyKey) {
        forwardMethod(target, propertyKey, 'get', config);
    };
};
exports.Post = function (config) {
    return function (target, propertyKey) {
        forwardMethod(target, propertyKey, 'post', config);
    };
};
exports.Head = function (config) {
    return function (target, propertyKey) {
        forwardMethod(target, propertyKey, 'head', config);
    };
};
exports.Delete = function (config) {
    return function (target, propertyKey) {
        forwardMethod(target, propertyKey, 'delete', config);
    };
};
exports.Put = function (config) {
    return function (target, propertyKey) {
        forwardMethod(target, propertyKey, 'put', config);
    };
};
