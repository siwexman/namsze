import { NextFunction, Request, Response } from 'express';
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handlerFactory';

import { Church } from '../models/ChurchModel';

export const getChurch = getOne(Church);

export const deleteChurch = deleteOne(Church);

export const updateChurch = updateOne(Church);

export const createChurch = createOne(Church);

export const getChurchWithMasses = getOne(
    Church,
    { path: 'masses' },
    'churchId'
);

export const getAllChurches = getAll(Church);

export const getNearChurchesWtihMasses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
    } catch (error) {}
};
