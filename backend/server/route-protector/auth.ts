import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction} from 'express';

interface IdecodedToken {
    email: string,
    userId: string
}

export const checkAuth = (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1] || '';
        const decodedToken: IdecodedToken = jwt.verify(token, "some_secret_key") as IdecodedToken;
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({message: "Protect auth failed!"});
    }
}
