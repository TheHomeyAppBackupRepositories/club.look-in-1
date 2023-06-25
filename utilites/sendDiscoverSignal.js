"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UDPserver_1 = require("./UDPserver");
const sendDiscoverSignal = (msg, port, ip) => {
    UDPserver_1.socket.setBroadcast(true);
    UDPserver_1.socket.send(Buffer.from(msg), port, ip, err => {
        if (err) {
            console.log('Error sending discover signal to remote!', err.stack);
        }
        else {
            console.log('The Discover signal was sent!');
        }
    });
};
exports.default = sendDiscoverSignal;
