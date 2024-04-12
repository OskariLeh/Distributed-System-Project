import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { hash, compare } from 'bcrypt';

const verifyRegistrationFields = (body: any): IUser | null => {
    if (!body?.name)
        return null;
    if (!body?.email)
        return null;
    if (!body?.password)
        return null;
    return body;
}

const alreadyRegistered = async (email: string): Promise<boolean> => {
    const exists = await User.exists({email: email});
    return exists !== null;
}

const hashPassword = async (passw: string): Promise<string | null> => {
    const saltrounds = 10;
    try {
        const h: string = await new Promise((resolve, reject) => {
            return hash(passw, saltrounds, (err: Error | undefined, hashed: string) => {
                if (err) {
                    reject(err);
                }
                resolve(hashed);
            });
        })
        return h;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const authPostRegister = async (req: Request, res: Response) => {
    const fields: IUser | null = verifyRegistrationFields(req.body);
    if (fields === null)
        return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
    const exists = await alreadyRegistered(fields.email);
    if (exists)
        return res.status(StatusCodes.CONFLICT).send("User with that email already registered");
    const hashed = await hashPassword(fields.password);
    if (hashed === null)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    const u: IUser = {name: fields.name, email: fields.email, password: hashed};
    User.create(u)
    .then((_) => res.status(StatusCodes.OK).send(ReasonPhrases.OK))
    .catch(e => {
        console.error(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    });
}

const authPostLogin = async (req: Request, res: Response) => {}

const authController = {
    authPostRegister,
    authPostLogin
}

export default authController;