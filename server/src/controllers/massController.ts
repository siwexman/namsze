import { Response, Request, NextFunction } from 'express';
import { Mass } from '../models/MassModel';
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './helpers/handlerFactory';

export const getAllMasses = getAll(Mass);

export const getMass = getOne(Mass);

export const deleteMass = deleteOne(Mass);

export const updateMass = updateOne(Mass);

export const createMass = createOne(Mass);
