"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = exports.emitter = void 0;
const dgram_1 = __importDefault(require("dgram"));
const sendDiscoverSignal_1 = __importDefault(require("./sendDiscoverSignal"));
const getAllDataFromRemote_1 = __importDefault(require("./getAllDataFromRemote"));
const events_1 = __importDefault(require("events"));
exports.emitter = new events_1.default();
const PORT = 61201;
const IP = '255.255.255.255';
const ALIVE = /LOOK\.?in:Alive!/;
const UPDATED_DATA = /LOOK\.?in:Updated!\w+:data:/;
const UPDATED_STATUS = /LOOK\.?in:Updated!\w+:87:FE:/;
const UPDATED_METEO = /LOOK\.?in:Updated!\w+:FE:00:\w{8}/;
const DISCOVER = 'LOOK.in:Discover!';
exports.socket = dgram_1.default.createSocket({ type: "udp4", reuseAddr: true });
const udpServer = async () => {
    return new Promise((resolve, reject) => {
        exports.socket.on('error', err => {
            reject(console.log('Server error', err.stack));
        });
        exports.socket.on('message', async (msg, rinfo) => {
            if (msg.toString().match(ALIVE)) {
                let alivePayload = msg.toString().replace(ALIVE, '');
                const remoteData = await (0, getAllDataFromRemote_1.default)(alivePayload);
                exports.emitter.emit('new_device', remoteData);
                resolve();
            }
            if (msg.toString().match(UPDATED_DATA)) {
                exports.emitter.emit('updated_data', msg.toString());
            }
            if (msg.toString().match(UPDATED_STATUS)) {
                exports.emitter.emit('updated_status', msg.toString());
            }
            if (msg.toString().match(UPDATED_METEO)) {
                exports.emitter.emit('updated_meteo', msg.toString());
            }
        });
        exports.socket.bind(PORT, () => {
            (0, sendDiscoverSignal_1.default)(DISCOVER, PORT, IP);
            console.log(`Server has been started on port ${PORT}`);
        });
    });
};
exports.default = udpServer;
