"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const winston_logger_1 = __importDefault(require("./winston.logger"));
const env_1 = require("../constant/env");
const stream = {
    // Use the http severity
    write: (message) => winston_logger_1.default.http(message.trim()),
};
const skip = () => {
    const env = env_1.NODE_ENV || "development";
    return env !== "development";
};
const morganMiddleware = (0, morgan_1.default)(":remote-addr :method :url :status - :response-time ms", { stream, skip });
exports.default = morganMiddleware;
