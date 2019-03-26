"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("../router");
/**
 * Used to implement factory services
 */
var InjectorPlugin = /** @class */ (function () {
    function InjectorPlugin() {
        this.globalProvide = {};
    }
    InjectorPlugin.prototype.onTenp = function (config) {
        this.globalProvide = this.initProvide(config.provide || []);
    };
    //Initialization service
    InjectorPlugin.prototype.initProvide = function (provide) {
        var provideMap = {};
        provide.forEach(function (data) {
            provideMap[data.name] = new data.class(data.data || null);
        });
        return provideMap;
    };
    //Step by step search service
    InjectorPlugin.prototype.searchServer = function (name, id) {
        var server = null;
        var routerInfo = router_1.dbRouterInfo[id];
        var pluginMap = routerInfo.config.provide;
        if (pluginMap[name]) {
            server = pluginMap[name];
        }
        else if (!routerInfo.functoin.prototype.$$parentId) {
            server = this.globalProvide[name] || null;
        }
        else {
            server = this.searchServer(name, routerInfo.functoin.prototype.$$parentId);
        }
        return server;
    };
    InjectorPlugin.prototype.onRouter = function ($class, routerConfig) {
        routerConfig.provide = this.initProvide(routerConfig.provide || []);
        for (var key in $class) {
            if (key.substr(0, 13) != 'tenp_provide_')
                continue;
            var name_1 = key.substr(13);
            $class[$class[key]] = this.searchServer(name_1, $class.$$id);
            delete $class[key];
        }
    };
    return InjectorPlugin;
}());
exports.default = InjectorPlugin;
exports.Injector = function (name) {
    return function (target, propertyKey) {
        target[propertyKey] = {};
        target['tenp_provide_' + name] = propertyKey;
    };
};
