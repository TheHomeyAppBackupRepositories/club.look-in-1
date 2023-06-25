"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("./httpRequest"));
const getNumberOfModes = async (UUID, IP, functionsArray) => {
    let modeFunction = functionsArray.filter(item => item.Name === 'mode')[0];
    if (modeFunction.Type === 'single') {
        return 1;
    }
    let response = JSON.parse(await (0, httpRequest_1.default)(IP, `/data/${UUID}/mode`));
    return response.Signals.length;
};
exports.default = getNumberOfModes;
