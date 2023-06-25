"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = __importDefault(require("../httpRequest"));
/**
 * This function is called each time, capability has been changed.
 * It checks for the corresponding function of remote controller in LOOKin APP and trying to send a request.
 * If no such function added in LOOKin APP or request has been rejected - the New error is thrown
 */
const sendRequest = async (device, command, alias, commName, IP, path) => {
    if (alias && !(device.getStoreValue('functions').find((item) => item.Name === alias)) || !command) {
        device.error(`No ${commName} command found! Please, create it in LOOKin APP first!`);
        throw new Error(`No ${commName} command found! Please, create it in LOOKin APP first!`);
    }
    let reqCheck = await (0, httpRequest_1.default)(IP, `${path}${command}`);
    if (JSON.parse(reqCheck).success === 'false') {
        device.error(`Failed to change the ${commName}! No connection to remote`);
        throw new Error(`Failed to change the ${commName}! No connection to remote`);
    }
};
exports.default = sendRequest;
