import { Schema, model, Types } from 'mongoose';

export interface IEvent {
    name: string;
    description: string;
    date: Date;
    creatorId: Types.ObjectId;
    participants: [Types.ObjectId]
}

export type IEventInDB = IEvent & {_id: Types.ObjectId};

const eventSchema = new Schema<IEvent>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    creatorId: { type: Schema.Types.ObjectId, required: true },
    participants: [{ type: Schema.Types.ObjectId, required: true }]
});

const EventModel = model<IEvent>('Event', eventSchema);

export default EventModel;