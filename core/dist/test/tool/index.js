"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToBoolean = function (value) {
    for (var obj in value) {
        value[obj] = true;
    }
    return value;
};
