import { Router } from 'express';
import userController from '../controllers/user_controller';

const userRouter = Router();

userRouter.post("/register", userController.authPostRegister);
userRouter.post("/login", userController.authPostLogin);

export default userRouter;