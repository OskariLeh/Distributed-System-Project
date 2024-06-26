import cors from 'cors';
import express, {Express} from "express";
import mongoose from 'mongoose';

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not set")
    process.exit(1);
}
// e.g. mongodb://127.0.0.1:27017/events
const uri: string | undefined = process.env.MONGO_URL;
if (!uri) {
    console.error("MONGO_URL not set.")
    process.exit(1);
}

// Setup passport for JWT authentication
import initPassport from './passport_setup';
initPassport();

mongoose.connect(uri).catch(e => {
  console.error("Failed to connect to mongo:", e);
  process.exit(1);
});

const app: Express = express();
app.use(cors({
    origin: 'http://localhost:3000', // React default port
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

import userRouter from './routes/users';
import eventRouter from './routes/events';
app.use("/user", userRouter);
app.use("/event", eventRouter);

export default app;