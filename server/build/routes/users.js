"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const userRouter = (0, express_1.Router)();
userRouter.post("/register", user_controller_1.default.authPostRegister);
userRouter.post("/login", user_controller_1.default.authPostLogin);
exports.default = userRouter;
