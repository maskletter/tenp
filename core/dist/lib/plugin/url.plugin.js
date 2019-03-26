"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Used to implement path inheritance between routers
 */
var UrlPlugin = /** @class */ (function () {
    function UrlPlugin() {
        //Storage root path
        this.baseUrl = '';
        //Storage routing path
        this.routerUrl = '';
        // code...
    }
    //Triggered when tenp is initialized
    UrlPlugin.prototype.onTenp = function (config) {
        // console.log(config)
        if (config.baseUrl) {
            this.baseUrl = config.baseUrl;
            // console.log('pathConfig.urlpathConfig.urlpathConfig.urlpathConfig.urlpathConfig.urlpathConfig.url')
        }
    };
    //Triggered when the router initializes
    UrlPlugin.prototype.onRouter = function ($class, routerConfig, parentConfig, config) {
        this.routerUrl = routerConfig.url = (parentConfig.url || '') + (routerConfig.url || '');
    };
    //Trigger when interface is initialized
    UrlPlugin.prototype.onInit = function (pathConfig) {
        pathConfig.url = this.baseUrl + this.routerUrl + pathConfig.url;
    };
    return UrlPlugin;
}());
exports.default = UrlPlugin;
