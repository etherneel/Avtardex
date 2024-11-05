"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_EXPIRY = exports.NODE_ENV = exports.SMTP_PROVIDER = exports.SMTP_SECURE = exports.SMTP_HOST = exports.SMTP_PORT = exports.REDIS_PORT = exports.REDIS_HOST = exports.EMAIL_FROM = exports.ADMIN_PASSWORD = exports.ADMIN_EMAIL = exports.MONGO_URL = exports.PORT = exports.PASSWORD = exports.EMAIL = exports.JWT_ACCESS_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
exports.EMAIL = process.env.EMAIL;
exports.PASSWORD = process.env.PASSWORD;
exports.PORT = process.env.PORT;
exports.MONGO_URL = process.env.MONGO_URL;
exports.ADMIN_EMAIL = process.env.ADMIN_EMAIL;
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
exports.EMAIL_FROM = process.env.EMAIL_FROM;
exports.REDIS_HOST = process.env.REDIS_HOST;
exports.REDIS_PORT = process.env.REDIS_PORT;
exports.SMTP_PORT = process.env.SMTP_PORT;
exports.SMTP_HOST = process.env.SMTP_HOST;
exports.SMTP_SECURE = process.env.SMTP_SECURE;
exports.SMTP_PROVIDER = process.env.SMTP_PROVIDER;
exports.NODE_ENV = process.env.NODE_ENV;
exports.TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;