"use strict";
exports.__esModule = true;
exports.objectToBoolean = function (value) {
    for (var obj in value) {
        value[obj] = true;
    }
    return value;
};
