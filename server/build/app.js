"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not set");
    process.exit(1);
}
// e.g. mongodb://127.0.0.1:27017/events
const uri = process.env.MONGO_URL;
if (!uri) {
    console.error("MONGO_URL not set.");
    process.exit(1);
}
// Setup passport for JWT authentication
const passport_setup_1 = __importDefault(require("./passport_setup"));
(0, passport_setup_1.default)();
mongoose_1.default.connect(uri).catch(e => {
    console.error("Failed to connect to mongo:", e);
    process.exit(1);
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // React default port
    optionsSuccessStatus: 200
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const users_1 = __importDefault(require("./routes/users"));
const events_1 = __importDefault(require("./routes/events"));
app.use("/user", users_1.default);
app.use("/event", events_1.default);
exports.default = app;
