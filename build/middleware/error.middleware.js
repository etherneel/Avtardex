"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const winston_logger_1 = __importDefault(require("../logger/winston.logger"));
const Users_1 = require("../utils/Users");
const zod_1 = require("zod");
const env_1 = require("../constant/env");
const errorHandler = (err, req, res, next) => {
    let error = err;
    if (error instanceof zod_1.ZodError) {
        return (0, Users_1.sendZodError)(res, error);
    }
    // Check if the error is an instance of an ApiError class which extends native Error class
    if (!(error instanceof ApiError_1.default)) {
        // if not
        // create a new ApiError instance to keep the consistency
        // assign an appropriate status code
        const statusCode = error.statusCode || error instanceof mongoose_1.default.Error ? 400 : 500;
        // set a message from native Error instance or a custom one
        const message = error.message || "Something went wrong";
        error = new ApiError_1.default(statusCode, message, (error === null || error === void 0 ? void 0 : error.errors) || [], err.stack);
    }
    // Now we are sure that the `error` variable will be an instance of ApiError class
    const response = Object.assign(Object.assign(Object.assign({}, error), { message: error.message }), (env_1.NODE_ENV === "development" ? { stack: error.stack } : {}));
    env_1.NODE_ENV === "development" && winston_logger_1.default.error(`${error.message}`);
    // Send error response
    return res.status(error.statusCode).json(response);
};
exports.errorHandler = errorHandler;
