"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ClaimRequestsSchema = new mongoose_1.default.Schema({
    email: {
        required: true,
        type: String,
    },
    amount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: "",
    },
    transactionId: {
        type: String,
        default: "",
    },
}, { timestamps: true });
//  here we are creating model / collection
const ClaimRequests = mongoose_1.default.model("ClaimRequests", ClaimRequestsSchema);
exports.default = ClaimRequests;
