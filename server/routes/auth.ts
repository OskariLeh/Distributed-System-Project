import { Router } from 'express';
import authController from '../controllers/auth_controller';

const authRouter = Router();

authRouter.post("/register", authController.authPostRegister);
authRouter.post("/login", authController.authPostLogin);

export default authRouter;