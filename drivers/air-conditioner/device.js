"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const httpRequest_1 = __importDefault(require("../../utilites/httpRequest"));
const UDPserver_1 = require("../../utilites/UDPserver");
class AirConditionerDevice extends homey_1.default.Device {
    async onInit() {
        const UUID = this.getStoreValue('UUID');
        let IP = this.getStoreValue('IP');
        const BASE_PATH = `/commands/ir/ac/`;
        let name = this.getName();
        let ID = this.getStoreValue('ID');
        /**
         * The following function gets information about current state of remote controller, being saved inside the LOOKin remote device
         * f.e. powerOn status - and set an actual value in store of the driver. It is called on init of device and in case of it's update.
         */
        const actualiseStatus = async () => {
            let RCInfo = JSON.parse(await (0, httpRequest_1.default)(IP, `/data/${UUID}`));
            if (RCInfo.success === 'false') {
                this.error('Failed to update status of device! No connection to remote');
                throw new Error('Failed to update status of device! No connection to remote');
            }
            await this.setStoreValue('status', RCInfo.Status).catch(this.error);
            await this.setCapabilityValue('onoff', !!this.getStoreValue('status')[0].match(/^[1-5]/)).catch(this.error);
            await this.setCapabilityValue('ac_mode', this.getStoreValue('status')[0]).catch(this.error);
            await this.setCapabilityValue('target_temperature.ac', parseInt(this.getStoreValue('status')[1], 16) + 16).catch(this.error);
            await this.setCapabilityValue('ac_fan_mode', this.getStoreValue('status')[2]).catch(this.error);
            await this.setCapabilityValue('ac_shutters_mode', this.getStoreValue('status')[3]).catch(this.error);
        };
        await actualiseStatus();
        /**
         * the next few lines looks for an "Update!" signal for this device, that might be received from LOOKin remote device via UDP
         * we need to check whether the characteristics or status or codeset of this device have been changed in LOOKin APP
         */
        const DATA_UPDATE_EXPRESSION = String.raw `LOOK\.?in:Updated!${ID}:data:${UUID}`;
        UDPserver_1.emitter.on('updated_data', async (msg) => {
            if (msg.match(RegExp(DATA_UPDATE_EXPRESSION))) {
                let RCInfo = JSON.parse(await (0, httpRequest_1.default)(IP, `/data/${UUID}`));
                if (RCInfo.success === 'false') {
                    this.error('Failed to update codeset of device! No connection to remote');
                    throw new Error('Failed to update codeset of device! No connection to remote');
                }
                await this.setStoreValue('codeset', RCInfo.Extra).catch(this.error);
            }
        });
        const STATUS_UPDATE_EXPRESSION = String.raw `LOOK\.?in:Updated!${ID}:87:FE:${UUID}`;
        UDPserver_1.emitter.on('updated_status', async (msg) => {
            if (msg.match(RegExp(STATUS_UPDATE_EXPRESSION))) {
                await actualiseStatus();
            }
        });
        const METEO_UPDATE_EXPRESSION = String.raw `LOOK\.?in:Updated!${ID}:FE:00:\w{8}`;
        UDPserver_1.emitter.on('updated_meteo', async (msg) => {
            if (msg.match(RegExp(METEO_UPDATE_EXPRESSION))) {
                let measuredTemp = parseInt(msg.slice(-8, -4), 16) / 10;
                await this.setCapabilityValue('measure_temperature.ac', measuredTemp).catch(this.error);
            }
        });
        /**
         * Next step, we need to describe the function, that is called each time, capability is being changed.
         * Since the command we need to send consists of constant part "base_part" and number of AC's IR code set,
         * we need to concatenate these parts and the exact command to be executed
         */
        const sendRequest = async (command, commName, IP, path) => {
            let exact_path = path + this.getStoreValue('codeset') + command;
            let reqCheck = await (0, httpRequest_1.default)(IP, exact_path);
            if (JSON.parse(reqCheck).success === 'false') {
                this.error(`Failed to change the ${commName}! No connection to remote`);
                throw new Error(`Failed to change the ${commName}! No connection to remote`);
            }
        };
        this.registerCapabilityListener('onoff', async () => {
            let status = this.getStoreValue('status');
            let powerCommand = status[0] === '0' ? 'FFF0' : '0' + status[1] + status[2] + status[3];
            await sendRequest(powerCommand, 'power status', IP, BASE_PATH);
        });
        this.registerCapabilityListener('ac_mode', async (value) => {
            let status = this.getStoreValue('status');
            let command = value.toString() + status[1] + status[2] + status[3];
            await sendRequest(command, 'Air Conditioner Mode', IP, BASE_PATH);
        });
        this.registerCapabilityListener('target_temperature.ac', async (value) => {
            let status = this.getStoreValue('status');
            let shiftHex = (value - 16).toString(16);
            let command = status[0] + shiftHex + status[2] + status[3];
            await sendRequest(command, 'Target Temperature', IP, BASE_PATH);
        });
        this.registerCapabilityListener('ac_fan_mode', async (value) => {
            let status = this.getStoreValue('status');
            let command = status[0] + status[1] + value.toString() + status[3];
            await sendRequest(command, 'Air Conditioner Fan Mode', IP, BASE_PATH);
        });
        this.registerCapabilityListener('ac_shutters_mode', async (value) => {
            let status = this.getStoreValue('status');
            let command = status[0] + status[1] + status[2] + value.toString();
            await sendRequest(command, 'Air Conditioner Shutters Mode', IP, BASE_PATH);
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
module.exports = AirConditionerDevice;
