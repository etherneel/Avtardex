import Users from "../model/UserSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { JWT_ACCESS_SECRET, TOKEN_EXPIRY } from "../constant/env";
import { saltround } from "../constant";
import {
  VALIDATE_EMAIL,
  VALIDATE_LOGIN,
  VALIDATE_SEND_EMAIL,
  VALIDATE_SIGNUP,
  VALIDATE_VERIFY_RESET_PASSWORD_OTP,
} from "../zod-schema/User.schema";
import { asyncHandler } from "../utils/AsyncHandler";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResonse";
import { enqueueEmail } from "../services/bullmq/email-queue";
import path from "path";
import fs from "fs";
export interface CustomRequest extends Request {
  id?: string; // Assuming id is a string
}

export default class UserController {
  static sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = VALIDATE_EMAIL.parse(req.body);
    let existingUser = await Users.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      // If the user already exists and is verified
      throw new ApiError(403, "Account already exists !");
    } else if (existingUser && !existingUser.isVerified) {
      throw new ApiError(403, "Please Verify your account !");
    } else {
      // Generate OTP
      const generatedOtp = Math.floor(Math.random() * 9000 + 1000);
      let newUser = {
        email,
        otp: generatedOtp,
        isVerified: false,
      };
      let userInfo = new Users(newUser);
      await userInfo.save();
      // Send OTP email
      const mailData = {
        to: email,
        subject: "Verification Code",
        text: "",
        html: `<span>Your Verification code is ${generatedOtp}</span>`,
      };
      // Assuming there's a function to send emails (e.g., sendMail)
      await enqueueEmail(mailData);
      return res
        .status(200)
        .json(new ApiResponse("OTP has been sent successfully!", null, 200));
    }
  });

  // Method to verify OTP and complete signup
  static verifyOtpAndSignup = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, password, otp } = VALIDATE_SIGNUP.parse(req.body);

      // Check if the user exists
      let existingUser = await Users.findOne({ email });

      if (!existingUser) {
        throw new ApiError(404, "No account found for the given email!");
      }

      // Check if OTP is valid
      if (existingUser.otp !== otp) {
        throw new ApiError(401, "Invalid OTP!");
      }

      // Check if the user is already verified
      if (existingUser.isVerified) {
        throw new ApiError(200, "Account already verified!");
      }

      // Hash the password
      let salt = await bcrypt.genSalt(saltround);
      let hash_password = await bcrypt.hash(password, salt);

      // Update the user to mark them as verified and set the password
      await Users.findOneAndUpdate(
        { email },
        { $set: { isVerified: true, password: hash_password, otp: null } },
        { new: true }
      );

      return res
        .status(200)
        .json(new ApiResponse("You are now successfully verified", null, 200));
    }
  );

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = VALIDATE_LOGIN.parse(req.body);
    let IsValidme = await Users.findOne({ email: email });
    if (!IsValidme) {
      throw new ApiError(403, "Invalid credential");
    } else {
      if (IsValidme.isVerified) {
        let data = {
          id: IsValidme.id,
          name: IsValidme.email,
        };
        let isMatch = await bcrypt.compare(
          password,
          IsValidme.password as string
        );
        if (isMatch) {
          let authToken = jwt.sign({ data }, JWT_ACCESS_SECRET, {
            expiresIn: TOKEN_EXPIRY,
          });
          return res
            .status(200)
            .json(
              new ApiResponse(
                "You have been successfully logged In !",
                { authToken },
                200
              )
            );
        } else {
          throw new ApiError(403, "Invalid credential");
        }
      } else {
        return res
          .status(401)
          .json(new ApiResponse("Please verify your email address", null, 401));
      }
    }
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = VALIDATE_SEND_EMAIL.parse(req.body);
    const otp = Math.floor(Math.random() * 9000 + 1000);
    const mailData = {
      to: email,
      subject: "Verifcation code for password reset",
      text: "",
      html: `<span>Your Verification code is ${otp}</span>`,
    };
    const user = await Users.findOne({ email });
    if (!user) {
      throw new ApiError(403, "User with this email does not exist");
    } else {
      user.otp = otp;
      await user.save();
      await enqueueEmail(mailData);
      return res
        .status(200)
        .json(new ApiResponse("Otp has been sent successfully !", null, 200));
    }
  });

  static verify_Reset_Password_Otp = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, password, otp } = VALIDATE_VERIFY_RESET_PASSWORD_OTP.parse(
        req.body
      );
      let salt = await bcrypt.genSalt(saltround);
      let hash_password = await bcrypt.hash(password, salt);
      let IsValid = await Users.findOne({
        $and: [{ email: email }, { otp: otp }],
      });
      if (IsValid) {
        await Users.findOneAndUpdate(
          { email: email },
          { password: hash_password },
          {
            returnOriginal: false,
          }
        );
        return res
          .status(200)
          .json(
            new ApiResponse(
              "You password have been changed successfully !",
              null,
              200
            )
          );
      } else {
        throw new ApiError(401, "Wrong Otp !");
      }
    }
  );

  static getProfile = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const userId = req.id; // Assuming `req.user` contains the authenticated user data
      const user = await Users.findById(userId).select(
        "-password -otp -isVerified"
      ); // Exclude password and OTP fields

      if (!user) {
        throw new ApiError(404, "User not found");
      }
      return res
        .status(200)
        .json(new ApiResponse("User profile fetched successfully", user, 200));
    }
  );

  static startKyc = asyncHandler(async (req: CustomRequest, res: Response) => {
    const { passportNumber } = req.body;

    // Check if user is authenticated
    const userId = req.id; // Assuming `req.user` contains the authenticated user info

    if (!userId) {
      throw new ApiError(401, "Unauthorized access");
    }

    // Check if the passport number is provided
    if (!passportNumber) {
      throw new ApiError(400, "Passport number is required");
    }

    // Check if the document (file) is provided
    if (!req.file) {
      throw new ApiError(400, "Document file is required");
    }

    // Find the user to check if KYC has already been submitted
    const user = await Users.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if the user has already submitted KYC
    if (user.passportNumber || user.kycDocument) {
      throw new ApiError(400, "KYC has already been submitted.");
    }

    // Save the file locally (you may want to store the path in your database)
    const uploadDirectory = path.join(__dirname, "../../uploads/kyc_documents");
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    const documentPath = path.join(uploadDirectory, req.file.filename);

    // Save the passport number and document path in the user's profile
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        passportNumber: passportNumber,
        kycDocument: documentPath, // Store the local path to the document
      },
      { new: true, runValidators: true }
    );
    console.log(updatedUser, "updatedUser");

    // Check if the update was successful
    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    // Respond with success
    return res.status(200).json({
      message: "KYC started successfully",
      passportNumber: updatedUser.passportNumber,
    });
});

}
