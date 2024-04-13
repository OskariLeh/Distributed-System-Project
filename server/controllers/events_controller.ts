import { Request, Response } from 'express';
import  EventModel, { IEvent } from '../models/event';
import { IUserInDB } from '../models/user';
import moment from 'moment';
import mongoose from 'mongoose';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const verifyCreateEventFields = (body: any, callingUserId: mongoose.Types.ObjectId): IEvent | null => {
    if (!body?.name)
        return null;
    if (!body?.description)
        return null;
    if (!body?.date)
        return null;
    // Date should be in the correct format
    const d = moment(body.date, "YYYY-MM-DDTHH:mm");
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

const eventsController = {
    eventsPostCreate
}

export default eventsController;