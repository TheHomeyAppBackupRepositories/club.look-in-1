"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("./httpRequest"));
const getDetailedRCInfo = async (data, IP, ID) => {
    let result = [];
    for await (let item of data) {
        let info = JSON.parse(await (0, httpRequest_1.default)(IP, `/data/${item.UUID}`));
        result.push({
            Type: item.Type,
            UUID: item.UUID,
            Updated: item.Updated,
            IP: IP,
            ID: ID,
            deviceInfo: info
        });
    }
    return result;
};
exports.default = getDetailedRCInfo;
