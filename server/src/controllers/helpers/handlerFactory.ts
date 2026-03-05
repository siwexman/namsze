import { Model } from 'mongoose';

import catchAsync from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';
import { APIFeatures } from '../../utils/apiFeatures';

import { PopOptions } from './types';
import { Church } from '../../models/ChurchModel';
import { NextFunction, Request, Response } from 'express';

export const getOne = <T>(
    Model: Model<T>,
    popOptions?: PopOptions | PopOptions[],
    paramName = 'id',
) =>
    catchAsync(async (req, res, next) => {
        const query = Model.findById(req.params[paramName]);

        const queryPop = popOptions ? query.populate(popOptions) : query;

        const doc = await queryPop;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            data: {
                data: doc,
            },
        });
    });

export const getAll = <T>(Model: Model<T>) =>
    catchAsync(async (req, res, next) => {
        const filter = req.params.churchId
            ? { church: req.params.churchId }
            : {};

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
            .contains();

        const doc = await features.query;

        res.status(200).json({
            results: doc.length,
            data: {
                data: doc,
            },
        });
    });

export const deleteOne = <T>(Model: Model<T>) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            data: null,
        });
    });

export const updateOne = <T>(Model: Model<T>) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            data: {
                data: doc,
            },
        });
    });

export const createOne = <T>(Model: Model<T>) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            data: {
                data: doc,
            },
        });
    });

export const getCitiesAutoComplete = catchAsync(async (req, res, next) => {
    const { query } = req.query;

    if (!query || query.toString().length < 2) {
        return res.json([]);
    }

    const regex = new RegExp(`^${query}`, 'i');

    const results = await Church.find({ city: regex })
        .select('city')
        .limit(5)
        .lean();

    const uniqueCities = [...new Set(results.map(r => r.city))];

    res.status(200).json(uniqueCities);
});

export const setFilenameToBody = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.file) {
        req.body.image = req.file.filename;
    }
    next();
};
