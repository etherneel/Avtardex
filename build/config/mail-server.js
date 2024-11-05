"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../constant/env");
const winston_logger_1 = __importDefault(require("../logger/winston.logger"));
exports.transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    secure: true,
    port: Number(env_1.SMTP_PORT),
    auth: {
        user: String(env_1.EMAIL),
        pass: String(env_1.PASSWORD),
    },
});
exports.transporter.on("error", (err) => {
    winston_logger_1.default.error(err);
});
