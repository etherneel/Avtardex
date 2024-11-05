"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendZodError = exports.Generate_Referal_Id = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Generate_Referal_Id = () => {
    const referralId = crypto_1.default.randomBytes(4).toString("hex"); // Generate 8-character hex string
    return referralId;
};
exports.Generate_Referal_Id = Generate_Referal_Id;
function sendZodError(res, error) {
    res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map((err) => err.message),
    });
}
exports.sendZodError = sendZodError;
