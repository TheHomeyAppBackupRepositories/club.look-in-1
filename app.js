"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOOKinApp = void 0;
const homey_1 = __importDefault(require("homey"));
const UDPserver_1 = __importDefault(require("./utilites/UDPserver"));
const UDPserver_2 = require("./utilites/UDPserver");
class LOOKinApp extends homey_1.default.App {
    /**
     * onInit is called when the app is initialized.
     */
    async onInit() {
        try {
            this.homey.env.LOOKinDevices = [];
            await (0, UDPserver_1.default)();
            UDPserver_2.emitter.on('new_device', (deviceData) => {
                const existingDevices = this.homey.env.LOOKinDevices;
                if (!existingDevices.find(existingDevice => existingDevice.ID === deviceData.ID)) {
                    this.homey.env.LOOKinDevices.push(deviceData);
                }
            });
        }
        catch (err) {
            console.log('UDP server error:', err.stack);
        }
        this.log('The App has been initialized');
    }
}
exports.LOOKinApp = LOOKinApp;
module.exports = LOOKinApp;
