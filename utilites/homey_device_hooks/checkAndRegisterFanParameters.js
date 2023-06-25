"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendRequest_1 = __importDefault(require("./sendRequest"));
/**
 * We need to set an appropriate type of such characteristics like 'speed' and 'swing' for fan-like devices
 * Single button is suitable for "single" type, but we need two buttons for "toggle" type - because of two different signals
 */
const checkAndRegisterFanParameters = async (device, characteristic, IP, path) => {
    try {
        if (device.getStoreValue('functions').find((item) => item.Name === characteristic && item.Type === 'single')) {
            switch (characteristic) {
                case 'swing': {
                    await device.addCapability('swing_btn');
                    device.registerCapabilityListener('swing_btn', async () => {
                        await (0, sendRequest_1.default)(device, '0AFF', 'swing', 'Swing', IP, path);
                    });
                    break;
                }
                case 'speed': {
                    await device.addCapability('speed_btn');
                    device.registerCapabilityListener('speed_btn', async () => {
                        await (0, sendRequest_1.default)(device, '0BFF', 'speed', 'Speed', IP, path);
                    });
                    break;
                }
                default:
                    break;
            }
        }
        if (device.getStoreValue('functions').find((item) => item.Name === characteristic && item.Type === 'toggle')) {
            switch (characteristic) {
                case 'swing': {
                    await device.addCapability('swing_mode1_btn');
                    await device.addCapability('swing_mode2_btn');
                    device.registerCapabilityListener('swing_mode1_btn', async () => {
                        await (0, sendRequest_1.default)(device, '0A00', 'swing', 'Swing Mode 1', IP, path);
                    });
                    device.registerCapabilityListener('swing_mode2_btn', async () => {
                        await (0, sendRequest_1.default)(device, '0A01', 'swing', 'Swing Mode 2', IP, path);
                    });
                    break;
                }
                case 'speed': {
                    await device.addCapability('speed_up_btn');
                    await device.addCapability('speed_down_btn');
                    device.registerCapabilityListener('speed_up_btn', async () => {
                        await (0, sendRequest_1.default)(device, '0B00', 'speed', 'Speed Up', IP, path);
                    });
                    device.registerCapabilityListener('speed_down_btn', async () => {
                        await (0, sendRequest_1.default)(device, '0B01', 'speed', 'Speed Down', IP, path);
                    });
                    break;
                }
                default:
                    break;
            }
        }
    }
    catch (err) {
        device.error('Failed to register fan parameters!');
        throw new Error('Failed to register fan parameters!');
    }
};
exports.default = checkAndRegisterFanParameters;
