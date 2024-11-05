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
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../constant/env");
const winston_logger_1 = __importDefault(require("../logger/winston.logger"));
console.log(env_1.MONGO_URL);
mongoose_1.default
    .connect(env_1.MONGO_URL, {
    // @ts-ignore
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => {
    winston_logger_1.default.info("Database Connected Successfully");
})
    .catch((err) => {
    winston_logger_1.default.error(err, "Database Connection Failed");
});
// Define a function to handle graceful shutdown
const gracefulShutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Disconnect from the MongoDB database
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from the database");
        console.log(`Received ${signal}. Exiting gracefully.`);
        process.exit(0); // Successful exit
    }
    catch (error) {
        winston_logger_1.default.error("Error occurred while disconnecting from the database:", error);
        process.exit(1); // Exit with a non-zero code to indicate failure
    }
});
const signals = ['SIGTERM', 'SIGINT', 'SIGQUIT'];
signals.map(signal => {
    process.on(signal, () => gracefulShutdown(signal));
});
