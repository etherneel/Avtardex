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
exports.sendEmail = exports.startBullMqWorker = void 0;
const bullmq_1 = require("bullmq");
const mail_server_1 = require("../../config/mail-server");
const env_1 = require("../../constant/env");
const redisClient_1 = __importDefault(require("../../config/redisClient"));
const constant_1 = require("../../constant");
const winston_logger_1 = __importDefault(require("../../logger/winston.logger"));
const startBullMqWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Process email jobs
        const worker = new bullmq_1.Worker(constant_1.EMAIL_QUEUE, (job) => __awaiter(void 0, void 0, void 0, function* () {
            // Extract email details from the job data
            const { to, subject, text, html } = job.data;
            try {
                // Send the email using Nodemailer
                yield sendEmail({ to, subject, text, html });
                winston_logger_1.default.info("Email sent successfully:", job.id);
            }
            catch (error) {
                winston_logger_1.default.error("Error sending email:", error);
                // Retry the job if it fails
                throw new Error(error);
            }
        }), { connection: redisClient_1.default, concurrency: 2 });
        worker.on("completed", (job) => {
            console.log(`Worker completed job ${job.id}`);
        });
        worker.on("ready", () => {
            winston_logger_1.default.info("BullmQ Worker is now ready to start !");
        });
        worker.on("failed", (job, error) => {
            winston_logger_1.default.error(`Worker failed job ${job.id}: ${error}`);
        });
    }
    catch (error) {
        winston_logger_1.default.error(error);
    }
});
exports.startBullMqWorker = startBullMqWorker;
function sendEmail(emailOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        // Define email options
        const mailOptions = Object.assign({ from: String(env_1.EMAIL_FROM) }, emailOptions);
        // Send the email
        try {
            winston_logger_1.default.info("Email sent successfully to :", mailOptions.to);
            const info = yield mail_server_1.transporter.sendMail(mailOptions);
            winston_logger_1.default.info("Email Info", info);
        }
        catch (error) {
            winston_logger_1.default.info(error);
        }
    });
}
exports.sendEmail = sendEmail;
