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
    const radius = [5 / 6378.1, 10 / 6378.1, 15 / 6378.1]; // convert kilometers to radians divide the kilometer value by 6378.1
    const queryRadius = req.query.radius
        ? [parseInt(req.query.radius.toString()) / 6378.1]
        : undefined;

    if (!latlng) {
        return next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng',
                404
            )
        );
    }

    const [latStr, lngStr] = latlng.split(',');

    if (!latStr || !lngStr) {
        return next(
            new AppError(
                'Please provide correct coordinates - containing only numbers',
                404
            )
        );
    }

    const lng = Number(lngStr.trim());
    const lat = Number(latStr.trim());

    let docs: IChurch[] = [];

    if (queryRadius) {
        docs = await getChurchesWithin(lng, lat, queryRadius);
    } else {
        docs = await getChurchesWithin(lng, lat, radius);
    }

    res.status(200).json({
        results: docs.length,
        data: {
            data: docs,
        },
    });
});

async function getChurchesWithin(lng: number, lat: number, radius: number[]) {
    let churches: IChurch[] = [];
    let i = 0;

    while (churches.length === 0 && i < radius.length) {
        churches = await Church.find({
            location: {
                $geoWithin: { $centerSphere: [[lng, lat], radius[i]] },
            },
        });

        console.log(churches);
        console.log(lng, lat);

        if (churches.length === 0) {
            i++;
        }
    }

    return churches;
}
