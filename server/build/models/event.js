"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    creatorId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, required: true }]
});
const EventModel = (0, mongoose_1.model)('Event', eventSchema);
exports.default = EventModel;
