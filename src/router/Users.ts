import express from "express";
import UserController from "../controller/User";
import authUser from "../middleware/authUser";
import upload from "../middleware/upload";

const router = express.Router();

router.post("/register", UserController.sendOtp);

router.post("/verify", UserController.verifyOtpAndSignup);

router.post("/login", UserController.login);

// Handle password update
router.post("/reset-password", UserController.resetPassword);

// verify otp and update password
router.put("/verify-reset-otp", UserController.verify_Reset_Password_Otp);

// profile
router.get("/profile", authUser, UserController.getProfile);

router.post(
  "/kyc",
  authUser,
  upload.single("document"),
  UserController.startKyc
);

export default router;
