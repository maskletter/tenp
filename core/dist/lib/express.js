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
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('express/lib/application');
var Route = require('express/lib/router/route');
exports.Route = Route;
var Router = require('express/lib/router');
exports.Router = Router;
var req = require('express/lib/request');
var res = require('express/lib/response');
function CreateProtoTypeMethod(statusObject, plugin) {
    for (var key in plugin) {
        if (plugin.hasOwnProperty(key)) {
            statusObject[key] = { configurable: true, enumerable: true, writable: true, value: plugin[key] };
        }
    }
}
/**
 * Expose `createApplication()`.
 */
exports.default = createApplication;
// exports = module.exports = createApplication;
function expandExpress(req, app, plugin) {
    return Object.create(req, __assign({ app: { configurable: true, enumerable: true, writable: true, value: app } }, plugin));
}
/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */
function createApplication(config) {
    config = Object.assign({
        plugin: []
    }, config);
    var app = function (req, res, next) {
        app.handle(req, res, next);
    };
    mixin(app, EventEmitter.prototype, false);
    mixin(app, proto, false);
    //自定义扩充express方法
    var pluginRequst = {};
    var pluginResponse = {};
    for (var _i = 0, _a = config.plugin; _i < _a.length; _i++) {
        var plugin = _a[_i];
        plugin = plugin;
        if (plugin.request) {
            CreateProtoTypeMethod(pluginRequst, plugin.request);
        }
        if (plugin.response) {
            CreateProtoTypeMethod(pluginResponse, plugin.response);
        }
    }
    // expose the prototype that will get set on requests
    app.request = expandExpress(req, app, pluginRequst);
    // expose the prototype that will get set on responses
    app.response = expandExpress(res, app, pluginResponse);
    app.init();
    return app;
}
/**
 * Expose the prototypes.
 */
exports.application = proto;
exports.request = req;
exports.response = res;
/**
 * Expose middleware
 */
exports.json = bodyParser.json;
exports.query = require('express/lib/middleware/query');
exports.serveStatic = require('serve-static');
exports.urlencoded = bodyParser.urlencoded;
/**
 * Replace removed middleware with an appropriate error message.
 */
var removedMiddlewares = [
    'bodyParser',
    'compress',
    'cookieSession',
    'session',
    'logger',
    'cookieParser',
    'favicon',
    'responseTime',
    'errorHandler',
    'timeout',
    'methodOverride',
    'vhost',
    'csrf',
    'directory',
    'limit',
    'multipart',
    'staticCache'
];
removedMiddlewares.forEach(function (name) {
    Object.defineProperty(exports, name, {
        get: function () {
            throw new Error('Most middleware (like ' + name + ') is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.');
        },
        configurable: true
    });
});
