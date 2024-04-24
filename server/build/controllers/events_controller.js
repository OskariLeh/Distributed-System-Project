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
const event_1 = __importDefault(require("../models/event"));
const user_1 = __importDefault(require("../models/user"));
const moment_1 = __importDefault(require("moment"));
const http_status_codes_1 = require("http-status-codes");
const DATE_STR_FORMAT = "YYYY-MM-DDTHH:mm";
const verifyEventJoinFields = (body) => {
    if (!(body === null || body === void 0 ? void 0 : body.name))
        return null;
    if (!(body === null || body === void 0 ? void 0 : body.date))
        return null;
    // Date should be in the correct format
    const d = (0, moment_1.default)(body.date, DATE_STR_FORMAT);
    if (!d.isValid())
        return null;
    body.date = d.toDate();
    return body;
};
const verifyCreateEventFields = (body, callingUserId) => {
    body = verifyEventJoinFields(body);
    if (body === null)
        return null;
    if (!(body === null || body === void 0 ? void 0 : body.description))
        return null;
    body.creatorId = callingUserId;
    body.participants = [];
    return body;
};
const getEventRegisteredOnDate = (name, date) => __awaiter(void 0, void 0, void 0, function* () {
    let startTime = new Date(date);
    startTime.setHours(0, 0);
    let endTime = new Date(date);
    endTime.setHours(23, 59);
    const e = yield event_1.default.findOne({
        name: name,
        date: {
            $gte: startTime,
            $lte: endTime
        }
    }).exec();
    return e;
});
const eventsPostCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const user = req.user;
    const fields = verifyCreateEventFields(req.body, user._id);
    if (fields === null)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    const e = yield getEventRegisteredOnDate(fields.name, fields.date);
    if (e !== null)
        return res.status(http_status_codes_1.StatusCodes.CONFLICT).send("Event with same name and date exists");
    event_1.default.create(fields)
        .then((_) => res.status(http_status_codes_1.StatusCodes.OK).send(http_status_codes_1.ReasonPhrases.OK))
        .catch(e => {
        console.error(e);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    });
});
const eventsGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dateStr = req.params.date;
    const d = (0, moment_1.default)(dateStr, DATE_STR_FORMAT);
    if (!d.isValid())
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    // Get all events from the given day of the year (from 00:00 to 23:59)
    let startTime = d.toDate();
    startTime.setHours(0, 0);
    let endTime = d.toDate();
    endTime.setHours(23, 59);
    try {
        const eventsOnDate = yield event_1.default.find({
            date: {
                $gte: startTime,
                $lte: endTime
            }
        }).exec();
        let toSend = [];
        for (const e of eventsOnDate) {
            const creator = yield user_1.default.findById(e.creatorId).exec();
            const participants = yield user_1.default.find({ "_id": { $in: e.participants } }).exec();
            toSend.push({ "name": e.name,
                "description": e.description,
                "date": e.date,
                "creator": creator === null || creator === void 0 ? void 0 : creator.name,
                "participants": participants.map(p => p.name) });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({ "events": toSend });
    }
    catch (e) {
        console.error(e);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});
const eventsPostJoin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const user = req.user;
    const fields = verifyEventJoinFields(req.body);
    console.log(fields);
    if (fields === null)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(http_status_codes_1.ReasonPhrases.BAD_REQUEST);
    const e = yield getEventRegisteredOnDate(fields.name, fields.date);
    if (e === null)
        return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send(http_status_codes_1.ReasonPhrases.NOT_FOUND);
    e.participants.push(user._id);
    e.save()
        .then((_) => res.status(http_status_codes_1.StatusCodes.OK).send(http_status_codes_1.ReasonPhrases.OK))
        .catch(e => {
        console.error(e);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    });
});
const eventsController = {
    eventsPostCreate,
    eventsGet,
    eventsPostJoin
};
exports.default = eventsController;
