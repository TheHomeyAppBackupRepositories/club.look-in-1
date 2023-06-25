"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const getDetailedRCInfo_1 = __importDefault(require("./getDetailedRCInfo"));
const getSavedRemoteControllers = async (IP, ID) => {
    return new Promise((resolve, reject) => {
        try {
            http.get({ host: IP, path: '/data' }, res => {
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });
                res.on('end', async () => {
                    let remotes = await (0, getDetailedRCInfo_1.default)(JSON.parse(data), IP, ID);
                    if (remotes) {
                        resolve(remotes);
                    }
                    else {
                        reject(console.log('No saved remotes found in LOOK.in device! Please, add some using LOOK.in app!'));
                    }
                });
                res.on('error', err => {
                    reject(console.log('Error getting saved remotes from LOOK.in device!', err.stack));
                });
            });
        }
        catch (err) {
            console.log('GET Saved Remote controllers has failed!');
            reject(console.log('HTTP GET Request Error:', err.stack));
        }
    });
};
exports.default = getSavedRemoteControllers;
