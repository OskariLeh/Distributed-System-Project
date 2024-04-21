"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_controller_1 = __importDefault(require("../controllers/events_controller"));
const passport_1 = __importDefault(require("passport"));
const eventRouter = (0, express_1.Router)();
eventRouter.post("/", passport_1.default.authenticate("jwt", { session: false }), events_controller_1.default.eventsPostCreate);
eventRouter.get("/:date", passport_1.default.authenticate("jwt", { session: false }), events_controller_1.default.eventsGet);
eventRouter.post("/join", passport_1.default.authenticate("jwt", { session: false }), events_controller_1.default.eventsPostJoin);
exports.default = eventRouter;
