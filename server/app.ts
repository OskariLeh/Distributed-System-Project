import cors from 'cors';
import express, {Express} from "express";
import mongoose from 'mongoose';

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


export default app;