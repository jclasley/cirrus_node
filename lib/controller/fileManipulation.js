"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeMsg = exports.readMsg = void 0;
var fs_1 = require("fs");
var readFile = fs_1.promises.readFile, writeFile = fs_1.promises.writeFile;
var path_1 = __importDefault(require("path"));
var dir = process.env.MSGDIR || path_1.default.resolve(__dirname, '../../messages');
var readMsg = function (username) {
    var msgPath = path_1.default.join(dir, username + ".txt");
    return readFile(msgPath) // forward error
        .then(function (chunk) { return chunk.toString(); });
};
exports.readMsg = readMsg;
var writeMsg = function (username, msg) {
    var msgPath = path_1.default.join(dir, username + ".txt");
    return writeFile(msgPath, msg);
};
exports.writeMsg = writeMsg;
