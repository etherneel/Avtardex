import nodemailer from "nodemailer";
import { EMAIL, PASSWORD, SMTP_HOST, SMTP_PORT } from "../constant/env";
import logger from "../logger/winston.logger";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  port: Number(SMTP_PORT),
  auth: {
    user: String(EMAIL),
    pass: String(PASSWORD),
  },
});
transporter.on("error", (err) => {
  logger.error(err);
});
