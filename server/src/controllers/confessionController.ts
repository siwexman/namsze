import { NextFunction, Request, Response } from 'express';
import { createOne, deleteOne, updateOne } from './helpers/handlerFactory';

import {
    SingleConfession,
    RecurringConfession,
} from '../models/ConfessionModel';

// LIVE CONFESSIONS

export const createSingleConfession = createOne(SingleConfession);

export const deleteSingleConfession = deleteOne(SingleConfession);

// RECURRING CONFESSIONS

export const createRecurringConfession = createOne(RecurringConfession);

export const deleteRecurringConfession = deleteOne(RecurringConfession);

export const updateRecurringConfession = updateOne(RecurringConfession);
