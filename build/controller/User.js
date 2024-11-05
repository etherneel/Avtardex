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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../constant/env");
const constant_1 = require("../constant");
const User_schema_1 = require("../zod-schema/User.schema");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const ApiResonse_1 = require("../utils/ApiResonse");
const email_queue_1 = require("../services/bullmq/email-queue");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class UserController {
}
_a = UserController;
UserController.sendOtp = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = User_schema_1.VALIDATE_EMAIL.parse(req.body);
    let existingUser = yield UserSchema_1.default.findOne({ email });
    if (existingUser && existingUser.isVerified) {
        // If the user already exists and is verified
        throw new ApiError_1.default(403, "Account already exists !");
    }
    else if (existingUser && !existingUser.isVerified) {
        throw new ApiError_1.default(403, "Please Verify your account !");
    }
    else {
        // Generate OTP
        const generatedOtp = Math.floor(Math.random() * 9000 + 1000);
        let newUser = {
            email,
            otp: generatedOtp,
            isVerified: false,
        };
        let userInfo = new UserSchema_1.default(newUser);
        yield userInfo.save();
        // Send OTP email
        const mailData = {
            to: email,
            subject: "Verification Code",
            text: "",
            html: `<span>Your Verification code is ${generatedOtp}</span>`,
        };
        // Assuming there's a function to send emails (e.g., sendMail)
        yield (0, email_queue_1.enqueueEmail)(mailData);
        return res
            .status(200)
            .json(new ApiResonse_1.ApiResponse("OTP has been sent successfully!", null, 200));
    }
}));
// Method to verify OTP and complete signup
UserController.verifyOtpAndSignup = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, otp } = User_schema_1.VALIDATE_SIGNUP.parse(req.body);
    // Check if the user exists
    let existingUser = yield UserSchema_1.default.findOne({ email });
    if (!existingUser) {
        throw new ApiError_1.default(404, "No account found for the given email!");
    }
    // Check if OTP is valid
    if (existingUser.otp !== otp) {
        throw new ApiError_1.default(401, "Invalid OTP!");
    }
    // Check if the user is already verified
    if (existingUser.isVerified) {
        throw new ApiError_1.default(200, "Account already verified!");
    }
    // Hash the password
    let salt = yield bcrypt_1.default.genSalt(constant_1.saltround);
    let hash_password = yield bcrypt_1.default.hash(password, salt);
    // Update the user to mark them as verified and set the password
    yield UserSchema_1.default.findOneAndUpdate({ email }, { $set: { isVerified: true, password: hash_password, otp: null } }, { new: true });
    return res
        .status(200)
        .json(new ApiResonse_1.ApiResponse("You are now successfully verified", null, 200));
}));
UserController.login = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = User_schema_1.VALIDATE_LOGIN.parse(req.body);
    let IsValidme = yield UserSchema_1.default.findOne({ email: email });
    if (!IsValidme) {
        throw new ApiError_1.default(403, "Invalid credential");
    }
    else {
        if (IsValidme.isVerified) {
            let data = {
                id: IsValidme.id,
                name: IsValidme.email,
            };
            let isMatch = yield bcrypt_1.default.compare(password, IsValidme.password);
            if (isMatch) {
                let authToken = jsonwebtoken_1.default.sign({ data }, env_1.JWT_ACCESS_SECRET, {
                    expiresIn: env_1.TOKEN_EXPIRY,
                });
                return res
                    .status(200)
                    .json(new ApiResonse_1.ApiResponse("You have been successfully logged In !", { authToken }, 200));
            }
            else {
                throw new ApiError_1.default(403, "Invalid credential");
            }
        }
        else {
            return res
                .status(401)
                .json(new ApiResonse_1.ApiResponse("Please verify your email address", null, 401));
        }
    }
}));
UserController.resetPassword = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = User_schema_1.VALIDATE_SEND_EMAIL.parse(req.body);
    const otp = Math.floor(Math.random() * 9000 + 1000);
    const mailData = {
        to: email,
        subject: "Verifcation code for password reset",
        text: "",
        html: `<span>Your Verification code is ${otp}</span>`,
    };
    const user = yield UserSchema_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(403, "User with this email does not exist");
    }
    else {
        user.otp = otp;
        yield user.save();
        yield (0, email_queue_1.enqueueEmail)(mailData);
        return res
            .status(200)
            .json(new ApiResonse_1.ApiResponse("Otp has been sent successfully !", null, 200));
    }
}));
UserController.verify_Reset_Password_Otp = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, otp } = User_schema_1.VALIDATE_VERIFY_RESET_PASSWORD_OTP.parse(req.body);
    let salt = yield bcrypt_1.default.genSalt(constant_1.saltround);
    let hash_password = yield bcrypt_1.default.hash(password, salt);
    let IsValid = yield UserSchema_1.default.findOne({
        $and: [{ email: email }, { otp: otp }],
    });
    if (IsValid) {
        yield UserSchema_1.default.findOneAndUpdate({ email: email }, { password: hash_password }, {
            returnOriginal: false,
        });
        return res
            .status(200)
            .json(new ApiResonse_1.ApiResponse("You password have been changed successfully !", null, 200));
    }
    else {
        throw new ApiError_1.default(401, "Wrong Otp !");
    }
}));
UserController.getProfile = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id; // Assuming `req.user` contains the authenticated user data
    const user = yield UserSchema_1.default.findById(userId).select("-password -otp -isVerified"); // Exclude password and OTP fields
    if (!user) {
        throw new ApiError_1.default(404, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResonse_1.ApiResponse("User profile fetched successfully", user, 200));
}));
UserController.startKyc = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { passportNumber } = req.body;
    // Check if user is authenticated
    const userId = req.id; // Assuming `req.user` contains the authenticated user info
    if (!userId) {
        throw new ApiError_1.default(401, "Unauthorized access");
    }
    // Check if the passport number is provided
    if (!passportNumber) {
        throw new ApiError_1.default(400, "Passport number is required");
    }
    // Check if the document (file) is provided
    if (!req.file) {
        throw new ApiError_1.default(400, "Document file is required");
    }
    // Find the user to check if KYC has already been submitted
    const user = yield UserSchema_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.default(404, "User not found");
    }
    // Check if the user has already submitted KYC
    if (user.passportNumber || user.kycDocument) {
        throw new ApiError_1.default(400, "KYC has already been submitted.");
    }
    // Save the file locally (you may want to store the path in your database)
    const uploadDirectory = path_1.default.join(__dirname, "../../uploads/kyc_documents");
    if (!fs_1.default.existsSync(uploadDirectory)) {
        fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
    }
    const documentPath = path_1.default.join(uploadDirectory, req.file.filename);
    // Save the passport number and document path in the user's profile
    const updatedUser = yield UserSchema_1.default.findByIdAndUpdate(userId, {
        passportNumber: passportNumber,
        kycDocument: documentPath, // Store the local path to the document
    }, { new: true, runValidators: true });
    console.log(updatedUser, "updatedUser");
    // Check if the update was successful
    if (!updatedUser) {
        throw new ApiError_1.default(404, "User not found");
    }
    // Respond with success
    return res.status(200).json({
        message: "KYC started successfully",
        passportNumber: updatedUser.passportNumber,
    });
}));
exports.default = UserController;
