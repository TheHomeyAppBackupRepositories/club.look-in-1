"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseDeviceAnswer_1 = __importDefault(require("./parseDeviceAnswer"));
const getSavedRemoteControllers_1 = __importDefault(require("./getSavedRemoteControllers"));
var ANSWER;
(function (ANSWER) {
    ANSWER[ANSWER["ID"] = 0] = "ID";
    ANSWER[ANSWER["type"] = 1] = "type";
    ANSWER[ANSWER["onBatteries"] = 2] = "onBatteries";
    ANSWER[ANSWER["IP"] = 3] = "IP";
    ANSWER[ANSWER["autoVersion"] = 4] = "autoVersion";
    ANSWER[ANSWER["storageVersion"] = 5] = "storageVersion";
})(ANSWER || (ANSWER = {}));
const getAllDataFromRemote = async (payload) => {
    let answerArray = (0, parseDeviceAnswer_1.default)(payload);
    let device = {
        ID: answerArray[ANSWER.ID],
        type: answerArray[ANSWER.type],
        onBatteries: answerArray[ANSWER.onBatteries],
        IP: answerArray[ANSWER.IP],
        autoVersion: answerArray[ANSWER.autoVersion],
        storageVersion: answerArray[ANSWER.storageVersion]
    };
    device.savedRC = await (0, getSavedRemoteControllers_1.default)(device.IP, device.ID);
    return device;
};
exports.default = getAllDataFromRemote;
