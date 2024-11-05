"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Users_1 = __importDefault(require("./router/Users"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./db/conn");
const env_1 = require("./constant/env");
const preseed_1 = __importDefault(require("./utils/preseed"));
const email_worker_1 = require("./services/bullmq/email-worker");
const error_middleware_1 = require("./middleware/error.middleware");
const winston_logger_1 = __importDefault(require("./logger/winston.logger"));
const morgan_logger_1 = __importDefault(require("./logger/morgan.logger"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// preseed data
(0, preseed_1.default)(); // return;
// BULLMQ worker
(0, email_worker_1.startBullMqWorker)();
// mongodb data sanitization to prevent NoSQL Injection
app.use((0, express_mongo_sanitize_1.default)());
app.use(morgan_logger_1.default);
app.use((0, cors_1.default)({ origin: "*", credentials: true }));
app.use("/users", Users_1.default);
// app.use("/admin", AdminRoute);
app.use(error_middleware_1.errorHandler);
app.listen(env_1.PORT, () => {
    winston_logger_1.default.info(`Server is running at port ${env_1.PORT}`);
});
