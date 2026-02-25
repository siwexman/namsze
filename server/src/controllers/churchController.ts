import { NextFunction, Request, Response } from 'express';
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
    getCitiesAutoComplete,
} from './helpers/handlerFactory';

import { Church } from '../models/ChurchModel';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import {
    getChurchesByMass,
    getChurchesByConfessions,
    getNearChurchesWithMasses,
} from './helpers/churchFactory';

export const getChurch = getOne(Church, [
    {
        path: 'masses',
    },
    { path: 'recurringConfessions' },
]);

export const deleteChurch = deleteOne(Church);

export const updateChurch = updateOne(Church);

export const createChurch = createOne(Church);

export const getAllChurches = getAll(Church);

// export const getChurchWithMasses = getOne(
//     Church,
//     { path: 'masses' },
//     'churchId',
// );

export const getChurchesMasses = getChurchesByMass;

export const getNearChurchesMasses = getNearChurchesWithMasses;

export const getChurchesConfessions = getChurchesByConfessions;

// User Inputs auto-complete
export const getCities = getCitiesAutoComplete;
