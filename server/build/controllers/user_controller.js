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
const user_1 = __importDefault(require("../models/user"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyLoginFields = (body) => {
    if (!(body === null || body === void 0 ? void 0 : body.email))
        return null;
    if (!(body === null || body === void 0 ? void 0 : body.password))
        return null;
    return body;
};
const verifyRegistrationFields = (body) => {
    if (!(body === null || body === void 0 ? void 0 : body.name))
        return null;
    if (verifyLoginFields(body) === null)
        return null;
    return body;
};
const alreadyRegistered = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield user_1.default.exists({ email: email });
    return exists !== null;
});
const hashPassword = (passw) => __awaiter(void 0, void 0, void 0, function* () {
    const saltrounds = 10;
    try {
        const h = yield new Promise((resolve, reject) => {
            return (0, bcrypt_1.hash)(passw, saltrounds, (err, hashed) => {
                if (err) {
                    reject(err);
                }
                resolve(hashed);
            });
        });
        return h;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
const userPostRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fields = verifyRegistrationFields(req.body);
    if (fields === null)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    const exists = yield alreadyRegistered(fields.email);
    if (exists)
        return res.status(http_status_codes_1.StatusCodes.CONFLICT).send("User with that email already registered");
    const hashed = yield hashPassword(fields.password);
    if (hashed === null)
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    const u = { name: fields.name, email: fields.email, password: hashed };
    user_1.default.create(u)
        .then((_) => res.status(http_status_codes_1.StatusCodes.OK).send(http_status_codes_1.ReasonPhrases.OK))
        .catch(e => {
        console.error(e);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    });
});
const userPostLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fields = verifyLoginFields(req.body);
    if (fields === null)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    const user = yield user_1.default.findOne({ email: fields.email }).exec();
    if (user === null)
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(http_status_codes_1.ReasonPhrases.NOT_FOUND);
    // Verify password
    const ok = yield (0, bcrypt_1.compare)(fields.password, user.password);
    if (!ok)
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send(http_status_codes_1.ReasonPhrases.FORBIDDEN);
    // Generate a JWT and send it to the client
    const jwtPayload = {
        email: fields.email
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(http_status_codes_1.StatusCodes.OK).json({ token });
});
const userController = {
    authPostRegister: userPostRegister,
    authPostLogin: userPostLogin
};
exports.default = userController;
