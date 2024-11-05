"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATE_FIND_TEAM = exports.VALIDATE_HANDLE_CLAIM_REQUEST = void 0;
const zod_1 = require("zod");
exports.VALIDATE_HANDLE_CLAIM_REQUEST = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "ID is Required ",
        invalid_type_error: "ID must be a String",
    }),
    status: zod_1.z.string({
        required_error: "Status is Required ",
        invalid_type_error: "Status must be a String",
    }),
    transactionId: zod_1.z.string({
        required_error: "TransactionId is Required ",
        invalid_type_error: "TransactionId must be a String",
    }),
});
exports.VALIDATE_FIND_TEAM = zod_1.z.object({
    id: zod_1.z.string({
        required_error: "Referral ID is Required ",
        invalid_type_error: "Referral ID must be a String",
    }),
});
