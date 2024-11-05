"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../controller/User"));
const authUser_1 = __importDefault(require("../middleware/authUser"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post("/register", User_1.default.sendOtp);
router.post("/verify", User_1.default.verifyOtpAndSignup);
router.post("/login", User_1.default.login);
// Handle password update
router.post("/reset-password", User_1.default.resetPassword);
// verify otp and update password
router.put("/verify-reset-otp", User_1.default.verify_Reset_Password_Otp);
// profile
router.get("/profile", authUser_1.default, User_1.default.getProfile);
router.post("/kyc", authUser_1.default, upload_1.default.single("document"), User_1.default.startKyc);
exports.default = router;
