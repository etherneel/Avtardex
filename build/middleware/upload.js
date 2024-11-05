"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Set up storage engine for Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDirectory = path_1.default.join(__dirname, '../../uploads/kyc_documents');
        // Ensure the upload directory exists
        if (!fs_1.default.existsSync(uploadDirectory)) {
            fs_1.default.mkdirSync(uploadDirectory, { recursive: true }); // Create the directory if it doesn't exist
        }
        cb(null, uploadDirectory); // Save file to the correct directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
// Create a Multer instance with the storage configuration
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
exports.default = upload;
