import { Schema, model } from 'mongoose';

export interface ICredentials {
    email: string;
    password: string;
}

export interface IUser extends ICredentials {
    name: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: true, required: true },
});

const User = model<IUser>('User', userSchema);

export default User;