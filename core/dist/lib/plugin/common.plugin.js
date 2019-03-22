"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Save_Global_Variable = {};
var CommonPlugin = /** @class */ (function () {
    function CommonPlugin() {
        this.global = {};
    }
    CommonPlugin.prototype.onTenp = function (config) {
        Save_Global_Variable = this.global = config.global;
    };
    CommonPlugin.prototype.onRouter = function ($class) {
        for (var key in $class) {
            if (key.substr(0, 13) != 'tenp_glogal_')
                continue;
            var name_1 = key.substr(12);
            $class[$class[key]] = this.global[name_1];
            delete $class[key];
        }
    };
    return CommonPlugin;
}());
exports.default = CommonPlugin;
exports.getGlobal = function (name) {
    if (!name) {
        return Save_Global_Variable;
    }
    else {
        return Save_Global_Variable[name];
    }
};
exports.Global = function (name) {
    return function (target, propertyKey) {
        target[propertyKey] = {};
        target['tenp_glogal_' + name] = propertyKey;
    };
};
