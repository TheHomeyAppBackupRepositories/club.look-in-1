"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseDeviceAnswer = (payload) => {
    let result = [];
    while (true) {
        let position = payload.indexOf(':');
        if (position === -1) {
            result.push(payload.toString());
            return result;
        }
        else {
            let add = payload.slice(0, position);
            result.push(add);
            payload = payload.slice(position + 1);
            parseDeviceAnswer(payload);
        }
    }
};
exports.default = parseDeviceAnswer;
