import { NextFunction, Request, Response } from 'express';

type FN = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn: FN) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((err: Error) => next(err));
    };
};

export default catchAsync;
