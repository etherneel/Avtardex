"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAdmin_1 = __importDefault(require("../middleware/isAdmin"));
const Admin_1 = __importDefault(require("../controller/Admin"));
const router = express_1.default.Router();
// TODO: need to change the admin login system 
// router.post("/login-otp", AdminController.sendLoginOtp);
router.post("/login", Admin_1.default.login);
router.get("/get-all-users", isAdmin_1.default, Admin_1.default.GET_ALL_USERS);
router.get("/get-all-users-without-team", isAdmin_1.default, Admin_1.default.GET_ALL_USERS_WITHOUT_TEAM);
router.get("/get-all-users-with-team", isAdmin_1.default, Admin_1.default.GET_ALL_USERS_WITH_TEAM);
router.get("/get-all-transactions", isAdmin_1.default, Admin_1.default.GET_ALL_TRANSACTIONS);
router.get("/get-all-claimrequest", isAdmin_1.default, Admin_1.default.GET_ALL_CLAIM_REQUESTS);
router.post("/update-claimrequest", isAdmin_1.default, Admin_1.default.HANDLE_CLAIM_REQUEST);
// get all the transaction of a specific User throuh admin panel
router.get("/find-team/:id", isAdmin_1.default, Admin_1.default.FIND_TEAM);
exports.default = router;
