import { Schema, model, Document } from 'mongoose';

export interface ICredentials {
    email: string;
    password: string;
}

export interface IUser extends ICredentials {
    name: string;
}

export interface IUserInDB extends IUser, Document {}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: true, required: true },
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;