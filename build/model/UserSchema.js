"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const UserSchema = new mongoose_1.default.Schema({
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    email: {
        required: false,
        unique: true,
        type: String,
        validate(data) {
            if (!validator_1.default.isEmail(data)) {
                throw new Error("Email is not valid");
            }
        },
    },
    password: {
        required: false,
        minlength: 5,
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        required: false,
        type: Number,
        default: null,
    },
    passportNumber: {
        type: String,
        required: false, // Set to true if you require passport number
        default: null
    },
    kycDocument: {
        default: null,
        type: String, // Store the path to the document
        required: false,
    },
}, { timestamps: true });
// Create model / collection
const Users = mongoose_1.default.model("User", UserSchema);
exports.default = Users;
