import { Model, PipelineStage } from 'mongoose';

import catchAsync from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';
import { APIFeatures } from '../../utils/apiFeatures';
import { Church } from '../../models/ChurchModel';
import {
    checkCoordinates,
    checkTimeFormat,
    fetchAllData,
    filterMass,
    getChurchesWithin,
} from './helpers';

import { PopOptions, MassFilter } from './types';
import { options } from 'axios';

export const getOne = <T>(
    Model: Model<T>,
    popOptions?: PopOptions,
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
            new: true,
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

// TODO: dokończyć
export const getChurchesByMass = catchAsync(async (req, res, next) => {
    const { time } = req.params;
    const { day, city, coords, radius } = req.query;

    if (!city && !coords) {
        return next(new AppError('Please provide city or coordinates', 400));
    }

    const queryRadius = coords && !radius ? 5 : Number(radius?.toString());

    const massFilter = filterMass(day?.toString(), time?.toString(), next);

    let pipelineChurch: PipelineStage;

    if (coords) {
        const [lat = 0, lng = 0] = checkCoordinates(coords, next) ?? [];

        pipelineChurch = {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
                distanceField: 'distance',
                maxDistance: queryRadius * 1000,
                spherical: true,
            },
        };
    } else {
        pipelineChurch = {
            $match: { city },
        };
    }

    const [hours, minutes] = massFilter.time.split(':');
    const timeFilter =
        minutes === '00' ? { $regex: `^${hours}:` } : massFilter.time;
    const pipelineTime = { $match: { time: timeFilter, day: massFilter.day } };

    const docs = await Church.aggregate([
        pipelineChurch,
        {
            $lookup: {
                from: 'masses',
                localField: '_id',
                foreignField: 'church',
                pipeline: [
                    pipelineTime,
                    {
                        $unset: ['__v', 'church'],
                    },
                ],
                as: 'masses',
            },
        },
        {
            $match: {
                'masses.0': { $exists: true },
            },
        },
        {
            $unset: '__v',
        },
        {
            $sort: { 'masses.time': 1, name: 1 },
        },
    ]);

    res.status(200).json({
        results: docs.length,
        data: docs,
    });
});

export const getNearChurchesWithMasses = catchAsync(async (req, res, next) => {
    const { latlng } = req.params;
    const { radius, day, time } = req.query;

    const massFilter = filterMass(day, time, next);

    // Radius default value 5 (by default in meters later * 1000 to become km)
    const queryRadius = radius ? Number(radius.toString()) : 1;

    const [lat = 0, lng = 0] = checkCoordinates(latlng, next) ?? [];
    const coordsStr = `${lng},${lat}`;

    const nearestChurches = await getChurchesWithin(
        lng,
        lat,
        queryRadius,
        massFilter,
    );

    const docs = await Promise.all(
        nearestChurches.map(async church => fetchAllData(church, coordsStr)),
    );

    res.status(200).json({
        results: docs.length,
        data: {
            data: docs,
        },
    });
});

export const getCitiesAutoComplete = catchAsync(async (req, res, next) => {});
