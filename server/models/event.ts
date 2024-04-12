import mongoose, { Schema, model } from 'mongoose';

export interface IEvent {
    name: string;
    description: string;
    date: Date;
    creatorId: mongoose.Types.ObjectId;
    participants: [mongoose.Types.ObjectId]
}

const eventSchema = new Schema<IEvent>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, required: true }]
});

const Event = model<IEvent>('Event', eventSchema);

export default Event;