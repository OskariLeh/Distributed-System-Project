import { Router } from 'express';
import eventsController from '../controllers/events_controller';
import passport from 'passport';

const eventRouter = Router();

eventRouter.post("/", passport.authenticate("jwt", {session: false}), eventsController.eventsPostCreate);
eventRouter.get("/:date", passport.authenticate("jwt", {session: false}), eventsController.eventsGet);
eventRouter.post("/join", passport.authenticate("jwt", {session: false}), eventsController.eventsPostJoin);

export default eventRouter;