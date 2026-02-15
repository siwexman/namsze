import { PipelineStage } from 'mongoose';
import axios from 'axios';

import { Church, IChurch } from '../../models/ChurchModel';
import {
    changeToCammelCase,
    checkCoordinates,
    filterMass,
    getChurchesPipline,
} from './helpers';
import { MassFilter } from './types';
import catchAsync from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';

/**
 * Fetch data from OpenRouteService API to calculate distance, duration of route and route for 2 profiles (car, walk).
 * @param church Church model from db
 * @param startLocation coordinates in foramt longitude,latitude
 * @returns Church with both profiles data as one object
 */
export async function fetchAllData(church: IChurch, startLocation: string) {
    // Profiles for driving car and walking
    const profiles = ['driving-car', 'foot-walking'];

    try {
        const profilesData = await Promise.all(
            profiles.map(async profile => {
                const orsRes = await axios.get(
                    `https://api.openrouteservice.org/v2/directions/${profile}`,
                    {
                        params: {
                            api_key: process.env.OPENROUTESERVICE_API_KEY,
                            start: startLocation,
                            end: church.location.coordinates.join(','),
                        },
                    },
                );

                return {
                    [changeToCammelCase(profile)]: {
                        distanceFromUser:
                            orsRes.data.features[0].properties.summary.distance, // distance in meters
                        duration:
                            orsRes.data.features[0].properties.summary.duration, // duration in seconds
                        // route: orsRes.data.features[0].geometry, // GeoJSON for the path
                    },
                };
            }),
        );

        const mergedProfiles = profilesData.reduce((acc, current) => {
            return { ...acc, ...current };
        }, {});

        return {
            ...church,
            profilesData: mergedProfiles,
        };
    } catch (error) {
        return {
            ...church,
            profilesData: { error: "Couldn't find distance or duration" },
        };
    }
}

/**
 * Function to filter churches and masses near coords within radius
 * @param lng Longitude of coordinates
 * @param lat Latitude of coordinates
 * @param radius Radius
 * @param massFilter Object used to filter masses
 * @returns IChurch[] in center of coords and given radius with filtered masses
 */
export async function getChurchesWithin(
    lng: number,
    lat: number,
    radius: number,
    massFilter: MassFilter,
) {
    let churches: IChurch[] = [];
    const maxDistanceMeters = radius * 1000;

    const { dayOfWeek, ...massFilterMatch } = massFilter;
    const time =
        typeof massFilter.time === 'string'
            ? massFilter.time
            : Object.values(massFilter.time)[0];

    churches = await Church.aggregate([
        {
            $geoNear: {
                near: { type: 'Point', coordinates: [lng, lat] },
                distanceField: 'distance',
                maxDistance: maxDistanceMeters,
                spherical: true,
            },
        },
        {
            $lookup: {
                from: 'masses',
                localField: '_id',
                foreignField: 'church',
                pipeline: [
                    {
                        $match: massFilterMatch,
                    },
                    {
                        $unset: ['__v', 'church'],
                    },
                ],
                as: 'masses',
            },
        },
        {
            $lookup: {
                from: 'liveconfessions',
                let: { church_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$church', '$$church_id'] },
                                    { $gt: ['$expireAt', time] },
                                ],
                            },
                        },
                    },
                    { $unset: ['__v', 'church'] },
                ],
                as: 'live',
            },
        },
        {
            $lookup: {
                from: 'recurringconfessions',
                let: { church_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$church', '$$church_id'] },
                                    { $eq: ['$dayOfWeek', dayOfWeek] },
                                    { $gt: ['$endTime', time] },
                                ],
                            },
                        },
                    },
                    { $unset: ['__v', 'church'] },
                ],
                as: 'recurring',
            },
        },
        {
            $addFields: {
                activeConfession: {
                    $arrayElemAt: [
                        { $concatArrays: ['$live', '$recurring'] },
                        0,
                    ],
                },
            },
        },
        {
            $match: {
                'masses.0': { $exists: true },
            },
        },
        { $unset: ['live', 'recurring', '__v'] },
        {
            $sort: { distance: 1 },
        },
    ]).limit(15);

    return churches;
}

// TODO: dokończyć
export const getChurchesByMass = catchAsync(async (req, res, next) => {
    const { pipelineChurch, pipelineTime } = getChurchesPipline(req, next);

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

export const getChurchesByConfessions = catchAsync(async (req, res, next) => {
    const { pipelineChurch, massFilter } = getChurchesPipline(req, next);

    const [hours, minutes] = massFilter.time.split(':').map(Number);
    const searchTime = new Date();
    searchTime.setHours(hours, minutes, 0, 0);

    let pipelineLiveConf: PipelineStage;

    if (searchTime.getDay() === massFilter.dayOfWeek) {
        pipelineLiveConf = {
            $lookup: {
                from: 'liveconfessions',
                let: { church_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$church', '$$church_id'] },
                                    { $gt: ['$expireAt', searchTime] },
                                ],
                            },
                        },
                    },
                    { $unset: ['__v', 'church'] },
                ],
                as: 'live',
            },
        };
    } else {
        pipelineLiveConf = { $addFields: { live: [] } };
    }

    const docs = await Church.aggregate([
        pipelineChurch,
        pipelineLiveConf,
        {
            $lookup: {
                from: 'recurringconfessions',
                let: { church_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$church', '$$church_id'] },
                                    {
                                        $eq: [
                                            '$dayOfWeek',
                                            massFilter.dayOfWeek,
                                        ],
                                    },
                                    { $gt: ['$endTime', massFilter.time] },
                                ],
                            },
                        },
                    },
                    { $unset: ['__v', 'church'] },
                ],
                as: 'recurring',
            },
        },
        {
            $addFields: {
                activeConfession: {
                    $arrayElemAt: [
                        { $concatArrays: ['$live', '$recurring'] },
                        0,
                    ],
                },
            },
        },
        {
            $match: {
                activeConfession: { $exists: true, $ne: null },
            },
        },
        { $unset: ['live', 'recurring', '__v'] },
    ]);

    res.status(200).json({
        results: docs.length,
        data: {
            data: docs,
        },
    });
});
