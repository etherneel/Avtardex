"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATE_ADD_TRANSACTION = exports.VALIDATE_CLAIM_REQUEST = exports.VALIDATE_VERIFY_RESET_PASSWORD_OTP = exports.VALIDATE_EMAIL = exports.VALIDATE_LOGIN = exports.VALIDATE_SIGNUP = exports.VALIDATE_SEND_EMAIL = void 0;
const zod_1 = require("zod");
exports.VALIDATE_SEND_EMAIL = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is Required" })
        .email({ message: "Enter a Valid Email ID" }),
});
exports.VALIDATE_SIGNUP = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Email is Required" }),
    password: zod_1.z
        .string({ required_error: "Password is Required" })
        .min(5, { message: "Min 5 char. is Required for Password" }),
    otp: zod_1.z.number({
        required_error: "Otp is Required",
        invalid_type_error: "Otp must be a Number",
        coerce: true,
    }),
});
exports.VALIDATE_LOGIN = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Email is Required" }),
    password: zod_1.z
        .string({ required_error: "Password is Required" })
        .min(5, { message: "Min 5 char. is Required for Password" }),
});
exports.VALIDATE_EMAIL = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Email is Required" }),
});
exports.VALIDATE_VERIFY_RESET_PASSWORD_OTP = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Email is Required" }),
    password: zod_1.z
        .string({ required_error: "Password is Required" })
        .min(5, { message: "Min 5 char. is Required for Password" }),
    otp: zod_1.z.number({
        required_error: "Otp is Required",
        invalid_type_error: "Otp must be a Number",
        coerce: true,
    }),
});
exports.VALIDATE_CLAIM_REQUEST = zod_1.z.object({
    amount: zod_1.z.number({
        required_error: "Amount is Required ",
        invalid_type_error: "Amount must be a Number",
    }),
});
exports.VALIDATE_ADD_TRANSACTION = zod_1.z.object({
    amount: zod_1.z.number({
        required_error: "Amount is Required ",
        invalid_type_error: "Amount must be a Number",
    }),
    txid: zod_1.z.string({
        required_error: "TransactionId is Required ",
        invalid_type_error: "TransactionId must be a String",
    }),
    account: zod_1.z.string({
        required_error: "Account is Required ",
        invalid_type_error: "Account must be a String",
    }),
});
