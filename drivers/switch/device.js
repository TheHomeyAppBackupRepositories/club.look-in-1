"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const getPowerSwitchCommand_1 = __importDefault(require("../../utilites/getPowerSwitchCommand"));
const UDPserver_1 = require("../../utilites/UDPserver");
const sendRequest_1 = __importDefault(require("../../utilites/homey_device_hooks/sendRequest"));
const actualiseStatus_1 = __importDefault(require("../../utilites/homey_device_hooks/actualiseStatus"));
const actualiseFunctions_1 = __importDefault(require("../../utilites/homey_device_hooks/actualiseFunctions"));
class SwitchDevice extends homey_1.default.Device {
    async onInit() {
        let UUID = this.getStoreValue('UUID');
        let IP = this.getStoreValue('IP');
        let path = `/commands/ir/localremote/${UUID}`;
        let name = this.getName();
        let ID = this.getStoreValue('ID');
        await (0, actualiseStatus_1.default)(this, IP, UUID);
        /**
         * the next few lines looks for an "Update!" signal for this device, that might be received from LOOKin remote device via UDP
         * we need to check whether the characteristics or status of this device have been changed in LOOKin APP
         */
        const DATA_UPDATE_EXPRESSION = String.raw `LOOK\.?in:Updated!${ID}:data:${UUID}`;
        UDPserver_1.emitter.on('updated_data', async (msg) => {
            if (msg.match(RegExp(DATA_UPDATE_EXPRESSION))) {
                await (0, actualiseFunctions_1.default)(this, IP, UUID);
            }
        });
        const STATUS_UPDATE_EXPRESSION = String.raw `LOOK\.?in:Updated!${ID}:87:FE:${UUID}`;
        UDPserver_1.emitter.on('updated_status', async (msg) => {
            if (msg.match(RegExp(STATUS_UPDATE_EXPRESSION))) {
                await (0, actualiseStatus_1.default)(this, IP, UUID);
            }
        });
        /**
         * exact commands may vary for different switches types (toggle, two singles or one single), so, we have to check it first
         * also, the inner APP state should not be mutated if HTTP request has been rejected - new Error is thrown in this case
         */
        this.registerCapabilityListener('onoff', async (value) => {
            let powerCommand = (0, getPowerSwitchCommand_1.default)(value, this.getStoreValue('functions'));
            await (0, sendRequest_1.default)(this, powerCommand, '', 'power', IP, path);
        });
        this.log(`${name} has been initialized`);
    }
    async onAdded() {
        let name = this.getName();
        this.log(`${name} has been added`);
    }
    async onSettings({ oldSettings: {}, newSettings: {}, changedKeys: {} }) {
        let name = this.getName();
        this.log(`${name} settings were changed`);
    }
    async onRenamed(name) {
        this.log(`Device was renamed to ${name}`);
    }
    async onDeleted() {
        let name = this.getName();
        this.log(`${name} has been deleted`);
    }
}
module.exports = SwitchDevice;
