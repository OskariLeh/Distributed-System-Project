import { Schema, model, Types, Document } from 'mongoose';

export interface IEventIdentifier {
    name: string;
    date: Date;
}

export interface IEvent extends IEventIdentifier {
    description: string;
    creatorId: Types.ObjectId;
    participants: [Types.ObjectId]
}

export interface IEventInDB extends IEvent, Document {}

const eventSchema = new Schema<IEvent>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    creatorId: { type: Schema.Types.ObjectId, required: true },
    participants: [{ type: Schema.Types.ObjectId, required: true }]
});

const EventModel = model<IEvent>('Event', eventSchema);

export default EventModel;