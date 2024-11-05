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
Object.defineProperty(exports, "__esModule", { value: true });
const CheckAdminExist = () => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const isAdminExist = await Users.findOne({ role: "admin" });
    //   if (!isAdminExist) {
    //     let salt = await bcrypt.genSalt(saltround);
    //     let hash_password = await bcrypt.hash(ADMIN_PASSWORD, salt);
    //     Users.create({
    //       email: ADMIN_EMAIL,
    //       password: hash_password,
    //       role: "admin",
    //       isVerified: true,
    //     });
    //     logger.info("Admin User Created !!");
    //     return;
    //   }
    //   logger.info("Admin User Already Exist !");
    //   return;
    // } catch (error) {
    //   throw error;
    // }
});
exports.default = CheckAdminExist;
