"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const UserSchema_1 = __importDefault(require("../model/UserSchema"));
const ClaimRequests_1 = __importDefault(require("../model/ClaimRequests"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../constant/env");
const Transaction_1 = __importDefault(require("../model/Transaction"));
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_schema_1 = require("../zod-schema/User.schema");
const Admin_schema_1 = require("../zod-schema/Admin.schema");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class UserController {
}
_a = UserController;
// static sendLoginOtp = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Please fill all fields!" });
//     }
//     const otp = Math.floor(Math.random() * 9000 + 1000);
//     const mailData = {
//       from: EMAIL,
//       to: req.body.email,
//       subject: "Verifcation code",
//       text: null,
//       html: `<span>Your Verification code is ${otp}</span>`,
//     };
//     let userInfo = await Users.findOneAndUpdate(
//       { email, role: "admin" },
//       {
//         otp,
//       }
//     );
//     if (!userInfo) {
//       return res.status(400).json({ message: "Invalid email" });
//     }
//     // return transporter.sendMail(mailData, (error, info) => {
//     // console.log(info, error);
//     // if (error) {
//     //   res.status(500).send("Server error");
//     // }
//     return res.json({ message: "Otp has been sent successfully !" });
//     // });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
UserController.login = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = User_schema_1.VALIDATE_LOGIN.parse(req.body);
    let IsValidme = yield UserSchema_1.default.findOne({ email: email, role: "admin" });
    if (!IsValidme) {
        throw new ApiError_1.default(403, "Invalid credential");
    }
    else {
        let data = {
            email: IsValidme.email,
            role: IsValidme.role,
            _id: IsValidme._id,
        };
        let isMatch = yield bcrypt_1.default.compare(password, IsValidme.password);
        if (isMatch) {
            const authToken = jsonwebtoken_1.default.sign({ data }, env_1.JWT_ACCESS_SECRET, {
                expiresIn: env_1.TOKEN_EXPIRY,
            });
            return res.status(200).json({ authToken });
        }
        else {
            throw new ApiError_1.default(403, "Invalid credential");
        }
    }
}));
UserController.GET_ALL_TRANSACTIONS = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const totalCount = yield Transaction_1.default.countDocuments();
    const totalRecords = totalCount ? totalCount : 0;
    const totalPages = Math.ceil(totalRecords / perPage); // Calculate total pages
    const result = yield Transaction_1.default.find({})
        .populate({ path: "user", select: "-password -otp" })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({
        createdAt: -1,
    });
    res.status(200).json({
        result,
        page,
        perPage,
        totalRecords,
        totalPages, // Include total pages in the response
    });
}));
UserController.GET_ALL_USERS = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const totalRecords = yield UserSchema_1.default.countDocuments();
    const result = yield UserSchema_1.default.find({});
    res.status(200).json({
        result,
        page,
        perPage,
        totalRecords, // Include totalCount in the response
        totalPages: Math.ceil(totalRecords / perPage), // Calculate and include totalPages
    });
}));
UserController.GET_ALL_USERS_WITHOUT_TEAM = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const totalRecords = yield UserSchema_1.default.countDocuments();
    const pipeline = [
        {
            $lookup: {
                from: "transactions",
                localField: "_id",
                foreignField: "user",
                as: "result",
            },
        },
        {
            $project: {
                _id: 1,
                email: 1,
                result: 1,
                createdAt: 1,
                referalId: 1,
                referedBy: 1,
                totalPurchase: {
                    $map: {
                        input: "$result",
                        as: "transaction",
                        in: "$$transaction.amount",
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                email: 1,
                referalId: 1,
                referedBy: 1,
                createdAt: 1,
                selfpurchase: {
                    $sum: "$totalPurchase",
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "referalId",
                foreignField: "referedBy",
                as: "result",
            },
        },
        {
            $match: {
                result: {
                    $exists: true,
                    $size: 0,
                },
            },
        },
        {
            $project: {
                _id: 1,
                email: 1,
                referalId: 1,
                referedBy: 1,
                createdAt: 1,
                selfpurchase: 1,
            },
        },
        {
            $sort: { createdAt: -1 }, // Sort by createdAt in descending order
        },
        {
            $skip: (page - 1) * perPage,
        },
        {
            $limit: perPage,
        },
    ];
    const result = yield UserSchema_1.default.aggregate(pipeline);
    res.status(200).json({
        result,
        page,
        perPage,
        totalRecords, // Include totalCount in the response
        totalPages: Math.ceil(totalRecords / perPage), // Calculate and include totalPages
    });
}));
UserController.GET_ALL_USERS_WITH_TEAM = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const totalRecords = yield UserSchema_1.default.countDocuments();
    const pipeline = [
        {
            $lookup: {
                from: "transactions",
                localField: "_id",
                foreignField: "user",
                as: "result",
            },
        },
        {
            $project: {
                _id: 1,
                email: 1,
                result: 1,
                createdAt: 1,
                referalId: 1,
                referedBy: 1,
                totalPurchase: {
                    $map: {
                        input: "$result",
                        as: "transaction",
                        in: "$$transaction.amount",
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                email: 1,
                referalId: 1,
                referedBy: 1,
                createdAt: 1,
                selfpurchase: {
                    $sum: "$totalPurchase",
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "referalId",
                foreignField: "referedBy",
                as: "result",
            },
        },
        {
            $project: {
                _id: 1,
                email: 1,
                referalId: 1,
                referedBy: 1,
                createdAt: 1,
                selfpurchase: 1,
                totalrefferdUser: {
                    $map: {
                        input: "$result",
                        as: "user",
                        in: "$$user._id",
                    },
                },
            },
        },
        {
            $addFields: {
                referedUsers: {
                    $size: "$totalrefferdUser",
                },
            },
        },
        {
            $unwind: {
                path: "$totalrefferdUser",
            },
        },
        {
            $lookup: {
                from: "transactions",
                localField: "totalrefferdUser",
                foreignField: "user",
                as: "result",
            },
        },
        {
            $addFields: {
                totalSumofAmount: {
                    $map: {
                        input: "$result",
                        as: "user",
                        in: "$$user.amount",
                    },
                },
            },
        },
        {
            $addFields: {
                totalReferedUsersPurchaseSum: {
                    $sum: "$totalSumofAmount",
                },
            },
        },
        {
            $group: {
                _id: "$_id",
                email: {
                    $first: "$email",
                },
                referalId: {
                    $first: "$referalId",
                },
                referedBy: {
                    $first: "$referedBy",
                },
                createdAt: {
                    $first: "$createdAt",
                },
                selfpurchase: {
                    $first: "$selfpurchase",
                },
                referedUsers: {
                    $first: "$referedUsers",
                },
                totalReferedUsersPurchaseSum: {
                    $sum: "$totalReferedUsersPurchaseSum",
                },
            },
        },
        {
            $sort: { createdAt: -1 }, // Sort by createdAt in descending order
        },
        {
            $skip: (page - 1) * perPage,
        },
        {
            $limit: perPage,
        },
    ];
    const result = yield UserSchema_1.default.aggregate(pipeline);
    res.status(200).json({
        result,
        page,
        perPage,
        totalRecords, // Include totalCount in the response
        totalPages: Math.ceil(totalRecords / perPage), // Calculate and include totalPages
    });
}));
UserController.GET_ALL_CLAIM_REQUESTS = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const totalCount = yield ClaimRequests_1.default.countDocuments();
    const result = yield ClaimRequests_1.default.find({})
        .skip((page - 1) * perPage)
        .limit(perPage);
    res.status(200).json({
        result,
        page,
        perPage,
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / perPage),
    });
}));
UserController.HANDLE_CLAIM_REQUEST = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, status, transactionId } = Admin_schema_1.VALIDATE_HANDLE_CLAIM_REQUEST.parse(req.body);
    let data = yield ClaimRequests_1.default.findById(new mongoose_1.Types.ObjectId(id));
    if (!data) {
        throw new ApiError_1.default(400, "Invalid id");
    }
    if (data.status == "approved" || data.status == "rejected") {
        throw new ApiError_1.default(400, "Already claim request is processed");
    }
    data.status = status;
    if (status == "approved") {
        let user = yield UserSchema_1.default.findOne({ email: data.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        data.transactionId = transactionId;
        yield user.save();
        yield data.save();
        // handle claim maybe ned to mulitply by 100 incase we dont multiplt the amlunt by 100 fron frontend
        return res.status(200).json({ message: "Claim request updated" });
    }
    else if (status == "rejected") {
        return res.status(200).json({ message: "Claim request updated" });
    }
    else {
        throw new ApiError_1.default(403, "Invalid transaction status");
    }
}));
UserController.FIND_TEAM = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = Admin_schema_1.VALIDATE_FIND_TEAM.parse(req.params);
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const perPage = parseInt(req.query.perPage) || 10; // Default to 10 items per page
    const skip = (page - 1) * perPage;
    const data = yield UserSchema_1.default.find({ referedBy: id }, {
        _id: 1,
        email: 1,
        createdAt: 1,
        referedBy: 1,
        referalId: 1,
        reward: 1,
    })
        .skip(skip)
        .limit(perPage);
    const totalCount = yield UserSchema_1.default.countDocuments({
        referedBy: id,
    });
    if (data.length > 0) {
        return res.status(200).json({
            data,
            page,
            perPage,
            totalRecords: totalCount,
            totalPages: Math.ceil(totalCount / perPage),
        });
    }
    else {
        throw new ApiError_1.default(400, "No team found");
    }
}));
exports.default = UserController;
