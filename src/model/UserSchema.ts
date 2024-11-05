import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    email: {
      required: false,
      unique: true,
      type: String,
      validate(data: string) {
        if (!validator.isEmail(data)) {
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
      default:null
    },
    kycDocument: {
      default:null,
      type: String, // Store the path to the document
      required: false,
    },
  },
  { timestamps: true }
);

// Create model / collection
const Users = mongoose.model("User", UserSchema);

export default Users;
