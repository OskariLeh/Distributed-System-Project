import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import UserModel, {IUserInDB} from './models/user';

const initPassport = () => {
    const opts: StrategyOptions = {
        jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!
    }
    passport.use(new Strategy(opts, async (jwtPayload, done) => {
        try {
            // Get the user's information
            const email: string = jwtPayload.email; 
            const u: IUserInDB | null = await UserModel.findOne({email}).exec();
            if (u === null)
                return done(null, false);
            return done(null, u);
        } catch (e) {
            console.error(e);
            return done(e, false);
        }
    }));
}

export default initPassport;