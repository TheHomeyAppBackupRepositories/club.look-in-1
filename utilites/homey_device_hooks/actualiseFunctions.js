"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("../httpRequest"));
/**
 * The following function gets information about current functions of remote controller in case of them changed inside the LOOKin remote device
 * f.e. powerOn/Off type (single/toggle) - and set an actual value in store of the driver. It is called when "updated!" signal has been received.
 */
const actualiseFunctions = async (device, IP, UUID) => {
    let RCInfo = JSON.parse(await (0, httpRequest_1.default)(IP, `/data/${UUID}`));
    if (RCInfo.success === 'false') {
        device.error('Failed to update functions of device! No connection to remote');
        throw new Error('Failed to update functions of device! No connection to remote');
    }
    await device.setStoreValue('functions', RCInfo.Functions).catch(device.error);
};
exports.default = actualiseFunctions;
