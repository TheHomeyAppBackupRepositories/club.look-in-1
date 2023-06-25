"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getNumberOfModes_1 = __importDefault(require("../getNumberOfModes"));
const sendRequest_1 = __importDefault(require("./sendRequest"));
/**
 * We need to set an appropriate type of "mode" capability - it depends of it's type "single" or "toggle"
 * Simple button is suitable for "single" type, but we need a picker UI component for "toggle" type
 */
const checkAndRegisterModeListener = async (device, IP, UUID, path) => {
    try {
        if (device.getStoreValue('functions').find((item) => item.Name === 'mode')) {
            let numberOfModes = await (0, getNumberOfModes_1.default)(UUID, IP, device.getStoreValue('functions'));
            switch (numberOfModes) {
                case 1: {
                    await device.addCapability('mode_btn');
                    device.registerCapabilityListener('mode_btn', async () => {
                        await (0, sendRequest_1.default)(device, '04FF', 'mode', 'Humidifier mode', IP, path);
                    });
                    break;
                }
                case 2: {
                    await device.addCapability('mode_2_picker');
                    device.registerCapabilityListener('mode_2_picker', async (value) => {
                        await (0, sendRequest_1.default)(device, `040${value}`, 'mode', 'Humidifier mode', IP, path);
                    });
                    break;
                }
                case 3: {
                    await device.addCapability('mode_3_picker');
                    device.registerCapabilityListener('mode_3_picker', async (value) => {
                        await (0, sendRequest_1.default)(device, `040${value}`, 'mode', 'Humidifier mode', IP, path);
                    });
                    break;
                }
                case 4: {
                    await device.addCapability('mode_4_picker');
                    device.registerCapabilityListener('mode_4_picker', async (value) => {
                        await (0, sendRequest_1.default)(device, `040${value}`, 'mode', 'Humidifier mode', IP, path);
                    });
                    break;
                }
                default:
                    break;
            }
        }
    }
    catch (err) {
        device.error('Failed to register modes of device!');
        throw new Error('Failed to register modes of device!');
    }
};
exports.default = checkAndRegisterModeListener;
