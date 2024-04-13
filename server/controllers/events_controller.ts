import { Request, Response } from 'express';
import  EventModel, { IEvent } from '../models/event';
import UserModel, { IUserInDB } from '../models/user';
import moment from 'moment';
import mongoose from 'mongoose';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const DATE_STR_FORMAT = "YYYY-MM-DDTHH:mm";

const verifyCreateEventFields = (body: any, callingUserId: mongoose.Types.ObjectId): IEvent | null => {
    if (!body?.name)
        return null;
    if (!body?.description)
        return null;
    if (!body?.date)
        return null;
    // Date should be in the correct format
    const d = moment(body.date, DATE_STR_FORMAT);
    if (!d.isValid())
        return null;
    body.date = d.toDate();
    body.creatorId = callingUserId;
    body.participants = [];
    return body;
}

const eventsPostCreate = async (req: Request, res: Response) => {
    // @ts-ignore
    const user: IUserInDB = req.user!;
    const fields: IEvent | null = verifyCreateEventFields(req.body, user._id);
    if (fields === null)
        return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
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
    const startTime = d.toDate().setHours(0, 0);
    const endTime = d.toDate().setHours(23, 59);
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
            toSend.push({"name": e.name,
                         "description": e.description,
                         "creator": creator?.name,
                         "participants": e.participants
            });
        }
        res.status(StatusCodes.OK).json({"events": toSend});
    } catch (e) {
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
    
}

const eventsController = {
    eventsPostCreate,
    eventsGet
}

export default eventsController;