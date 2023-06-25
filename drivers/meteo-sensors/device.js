"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const UDPserver_1 = require("../../utilites/UDPserver");
class MeteoSensor extends homey_1.default.Device {
    async onInit() {
        let name = this.getName();
        let ID = this.getStoreValue('ID');
        const METEO_UPDATE_EXPRESSION = String.raw `LOOK\.?in:Updated!${ID}:FE:00:\w{8}`;
        UDPserver_1.emitter.on('updated_meteo', async (msg) => {
            if (msg.match(RegExp(METEO_UPDATE_EXPRESSION))) {
                let measuredTemp = parseInt(msg.slice(-8, -4), 16) / 10;
                let measuredHumidity = parseInt(msg.slice(-4), 16) / 10;
                await this.setCapabilityValue('measure_temperature', measuredTemp).catch(this.error);
                await this.setCapabilityValue('measure_humidity', measuredHumidity).catch(this.error);
            }
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
        this.log(`Sensors was renamed to ${name}`);
    }
    async onDeleted() {
        let name = this.getName();
        this.log(`${name} has been deleted`);
    }
}
module.exports = MeteoSensor;
