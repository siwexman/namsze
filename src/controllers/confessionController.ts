import { NextFunction, Request, Response } from 'express';
import { createOne, deleteOne, updateOne } from './helpers/handlerFactory';

import { LiveConfession, RecurringConfession } from '../models/ConfessionModel';

// LIVE CONFESSIONS

export const createLiveConfession = createOne(LiveConfession);

export const deleteLiveConfession = deleteOne(LiveConfession);

// RECURRING CONFESSIONS

export const createRecurringConfession = createOne(RecurringConfession);

export const deleteRecurringConfession = deleteOne(RecurringConfession);

export const updateRecurringConfession = updateOne(RecurringConfession);
