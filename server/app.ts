import cors from 'cors';
import express, {Express} from "express";
import mongoose from 'mongoose';

// e.g. mongodb://127.0.0.1:27017/events
const uri: string | undefined = process.env.MONGO_URL;
if (!uri) {
    console.error("MONGO_URL not set.")
    process.exit(1);
}
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

import authRouter from './routes/auth';
app.use("/auth", authRouter);

export default app;