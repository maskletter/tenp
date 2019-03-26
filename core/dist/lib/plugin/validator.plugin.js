"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidatorPlugin = /** @class */ (function () {
    function ValidatorPlugin() {
        this.defaultType = {
            phone: /^1[34578]\d{9}$/,
            email: /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        };
        // code...
    }
    ValidatorPlugin.prototype.defaultDone = function (data, request, response) {
        response.json(data);
    };
    ValidatorPlugin.prototype.validator = function (data, validator, request, response) {
        var done = validator.done ? validator.done : this.globalDone ? this.globalDone : this.defaultDone;
        var result = false;
        for (var name_1 in validator) {
            if (name_1 == 'done')
                continue;
            var value = validator[name_1];
            var __d = data[name_1] || value.default || undefined;
            var message = value.message || {};
            if (value.required != false && __d == void 0) {
                done({ name: 'required', value: __d, message: message.required }, request, response);
                result = false;
                break;
            }
            else if (value.type && this.defaultType[value.type] && !this.defaultType[value.type].test(__d)) {
                done({ name: 'type', value: __d, message: message.type }, request, response);
                result = false;
                break;
            }
            else if (value.length) {
                if (value.length[1] != -1) {
                    if (!(__d.length < value.length[0] && __d.length > value.length[1])) {
                        done({ name: 'length', value: __d, message: message.length }, request, response);
                        result = false;
                        break;
                    }
                }
                else {
                    if (__d.length < value.length[0]) {
                        done({ name: 'length', value: __d, message: message.length }, request, response);
                        result = false;
                        break;
                    }
                }
            }
            else if (value.regular && !value.regular.test(__d)) {
                done({ name: 'regular', value: __d, message: message.regular }, request, response);
                result = false;
                break;
            }
            else {
                result = true;
            }
        }
        return result;
    };
    ValidatorPlugin.prototype.mininData = function (request) {
        return Object.assign({}, request.params, request.query, request.body);
    };
    ValidatorPlugin.prototype.onAfter = function (pathConfig, config, request, response) {
        if (!pathConfig.validator)
            return true;
        var defaultType = pathConfig.validatorType || (pathConfig.type == 'post' ? 'body' : 'query');
        var data = {};
        if (defaultType == 'all') {
            data = this.mininData(request);
        }
        else {
            data = request[defaultType];
        }
        return this.validator(data, pathConfig.validator, request, response);
    };
    return ValidatorPlugin;
}());
exports.default = ValidatorPlugin;
