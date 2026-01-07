import { NextFunction, Request, Response } from 'express';
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handlerFactory';

import { Church, IChurch } from '../models/ChurchModel';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { appendFile } from 'node:fs';

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

export const getNearChurchesWtihMasses = catchAsync(async (req, res, next) => {
    const { latlng, time } = req.params;
    const radius = [5, 10, 15]; // convert kilometers to radians divide the kilometer value by 6378.1
    const queryRadius = req.query.radius
        ? [parseInt(req.query.radius.toString())]
        : undefined;

    const dayNumber = req.query.day ? parseInt(req.query.day.toString()) : 0;
    const day = dayNumber === 0 ? 'sunday' : 'weekday';

    if (!latlng) {
        return next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng',
                404
            )
        );
    }

    if (!time) {
        return next(
            new AppError('Please provide time in the format HH:mm', 404)
        );
    }

    const [latStr, lngStr] = latlng.split(',');

    const lng = Number(lngStr!.trim());
    const lat = Number(latStr!.trim());

    if (isNaN(lat) || isNaN(lng)) {
        return next(
            new AppError(
                'Please provide correct coordinates - containing only numbers',
                404
            )
        );
    }

    // let docs: IChurch[] = [];
    const docs = await getChurchesWithin(
        lng,
        lat,
        queryRadius ? queryRadius : radius,
        time,
        day
    );

    res.status(200).json({
        results: docs.length,
        data: {
            data: docs,
        },
    });
});

async function getChurchesWithin(
    lng: number,
    lat: number,
    radius: number[],
    time: string,
    day: 'sunday' | 'weekday'
) {
    let churches: IChurch[] = [];
    let i = 0;

    while (churches.length === 0 && i < radius.length) {
        // churches = await Church.find({
        //     location: {
        //         $geoWithin: { $centerSphere: [[lng, lat], radius[i]] },
        //     },
        // }).populate({
        //     path: 'masses',
        //     select: 'time day description',
        //     match: {
        //         time: { $gte: time, $lte: addHoursToTime(time, 2) },
        //         day: { $eq: day },
        //     },
        // });

        churches = await Church.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [lng, lat] },
                    distanceField: 'distance',
                    maxDistance: (radius[i] as number) * 1000,
                    spherical: true,
                },
            },
            {
                $lookup: {
                    from: 'masses',
                    let: { churchId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$church', '$$churchId'] },
                                        { $eq: ['$day', day] },
                                        { $gte: ['$time', time] },
                                        // {
                                        //     $lte: [
                                        //         '$time',
                                        //         addHoursToTime(time, 2),
                                        //     ],
                                        // },
                                    ],
                                },
                            },
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
        ]);

        if (churches.length === 0) {
            i++;
        }
    }

    return churches;
}

function addHoursToTime(startTime: string, hoursToAdd: number) {
    const [hours, minutes] = startTime.split(':');

    const newHours = (Number(hours) + hoursToAdd) % 24;

    return `${newHours.toString().padStart(2, '0')}:${
        minutes ? minutes : '00'
    }`;
}
