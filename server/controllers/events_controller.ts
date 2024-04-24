import { Request, Response } from 'express';
import  EventModel, { IEvent, IEventIdentifier, IEventInDB } from '../models/event';
import UserModel, { IUserInDB } from '../models/user';
import moment from 'moment';
import mongoose from 'mongoose';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const DATE_STR_FORMAT = "YYYY-MM-DDTHH:mm";

const verifyEventJoinFields = (body: any): IEventIdentifier | null => {
    if (!body?.name)
        return null;
    if (!body?.date)
        return null;
    // Date should be in the correct format
    const d = moment(body.date, DATE_STR_FORMAT);
    if (!d.isValid())
        return null;
    body.date = d.toDate();
    return body;
}

const verifyCreateEventFields = (body: any, callingUserId: mongoose.Types.ObjectId): IEvent | null => {
    body = verifyEventJoinFields(body);
    if (body === null)
        return null;
    if (!body?.description)
        return null;
    body.creatorId = callingUserId;
    body.participants = [];
    return body;
}

const getEventRegisteredOnDate = async (name: string, date: Date): Promise<IEventInDB | null> => {
    let startTime = new Date(date);
    startTime.setHours(0, 0);
    let endTime = new Date(date);
    endTime.setHours(23, 59);
    const e = await EventModel.findOne({
            name: name,
            date: {
                $gte: startTime, 
                $lte: endTime
            }
        }).exec();
    return e;
}

const eventsPostCreate = async (req: Request, res: Response) => {
    // @ts-ignore
    const user: IUserInDB = req.user!;
    const fields: IEvent | null = verifyCreateEventFields(req.body, user._id);
    if (fields === null)
        return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    const e: IEventInDB | null = await getEventRegisteredOnDate(fields.name, fields.date);
    if (e !== null)
        return res.status(StatusCodes.CONFLICT).send("Event with same name and date exists")
    EventModel.create(fields)
    .then((_) => res.status(StatusCodes.OK).send(ReasonPhrases.OK))
    .catch(e => {
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    });
}

const eventsGet = async (req: Request, res: Response) => {
    const dateStr: string = req.params.date;
    const d = moment(dateStr, DATE_STR_FORMAT);
    if (!d.isValid())
        return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    // Get all events from the given day of the year (from 00:00 to 23:59)
    let startTime = d.toDate()
    startTime.setHours(0, 0);
    let endTime = d.toDate()
    endTime.setHours(23, 59);
    try {
        const eventsOnDate = await EventModel.find({
            date: {
                $gte: startTime, 
                $lte: endTime
            }
        }).exec();
        let toSend = [];
        for (const e of eventsOnDate) {
            const creator = await UserModel.findById(e.creatorId).exec();
            const participants = await UserModel.find({"_id": {$in: e.participants}}).exec();
            toSend.push({"name": e.name,
                         "description": e.description,
                         "date": e.date,
                         "creator": creator?.name,
                         "participants": participants.map(p => p.name)
            });
        }
        res.status(StatusCodes.OK).json({"events": toSend});
    } catch (e) {
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
}

const eventsPostJoin = async (req: Request, res: Response) => {
    // @ts-ignore
    const user: IUserInDB = req.user!;
    const fields: IEventIdentifier | null = verifyEventJoinFields(req.body);
    console.log(fields)
    if (fields === null)
        return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    const e: IEventInDB | null = await getEventRegisteredOnDate(fields.name, fields.date);
    if (e === null)
        return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    e.participants.push(user._id);
    e.save()
    .then((_) => res.status(StatusCodes.OK).send(ReasonPhrases.OK))
    .catch(e => {
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    });
}


const eventsController = {
    eventsPostCreate,
    eventsGet,
    eventsPostJoin
}

export default eventsController;