import { Router } from 'express';
import eventsController from '../controllers/events_controller';
import passport from 'passport';

const eventRouter = Router();

eventRouter.post("/", passport.authenticate("jwt", {session: false}), eventsController.eventsPostCreate);

export default eventRouter;