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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema_1 = __importDefault(require("../model/UserSchema"));
const env_1 = require("../constant/env");
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = String(req.headers["auth-token"]);
    try {
        if (!token) {
            return res.status(401).send("Access denied");
        }
        jsonwebtoken_1.default.verify(token, env_1.JWT_ACCESS_SECRET, function (_error, { data }) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield UserSchema_1.default.findById(data.id);
                if (user !== null && user.role !== "admin") {
                    return res.status(401).send("Access denied");
                }
                next();
            });
        });
    }
    catch (error) {
        res.status(401).send("Access denied");
    }
});
exports.default = isAdmin;
