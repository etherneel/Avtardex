"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../constant/env");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResonse_1 = require("../utils/ApiResonse");
const authUser = (req, res, next) => {
    const token = req.headers["authorization"];
    try {
        if (!token) {
            throw new ApiError_1.default(401, "Access Denied !");
        }
        // @ts-ignore
        const { data } = jsonwebtoken_1.default.verify(token, env_1.JWT_ACCESS_SECRET);
        req.id = data.id;
        next();
    }
    catch (error) {
        res.status(401).json(new ApiResonse_1.ApiResponse(error.message, null, 401));
    }
};
exports.default = authUser;
