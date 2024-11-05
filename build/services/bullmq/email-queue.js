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
exports.enqueueEmail = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const redisClient_1 = __importDefault(require("../../config/redisClient"));
const constant_1 = require("../../constant");
exports.emailQueue = new bullmq_1.Queue(constant_1.EMAIL_QUEUE, {
    connection: redisClient_1.default,
});
// Function to enqueue an email job
function enqueueEmail(emailOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.emailQueue.add("send-email", Object.assign({}, emailOptions), { attempts: 3 });
    });
}
exports.enqueueEmail = enqueueEmail;
