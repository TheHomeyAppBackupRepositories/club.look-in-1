"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPowerSwitchCommand = (value, functions) => {
    if (functions.find(item => item.Name === 'poweron') && functions.find(item => item.Name === 'poweroff')) {
        return value ? '02FF' : '03FF';
    }
    if (functions.find(item => item.Name === 'power' && item.Type === 'toggle')) {
        return value ? '0100' : '0101';
    }
    if (functions.find(item => item.Name === 'power' && item.Type === 'single')) {
        return '01FF';
    }
    else
        return '';
};
exports.default = getPowerSwitchCommand;
