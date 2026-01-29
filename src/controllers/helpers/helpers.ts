import axios from 'axios';

import { Church, IChurch } from '../../models/ChurchModel';
import { MassFilter, ParamQuery } from './types';
import { NextFunction } from 'express';
import { AppError } from '../../utils/appError';

export function changeToCammelCase(kebabCase: string) {
    return kebabCase.replace(/-([a-z])/g, (match, letter) =>
        letter.toUpperCase(),
    );
}

export function checkCoordinates(latlng: ParamQuery, next: NextFunction) {
    if (!latlng || Array.isArray(latlng)) {
        return next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng',
                400,
            ),
        );
    }

    const [latStr, lngStr] = latlng.toString().split(',');

    const lng = Number(lngStr!.trim());
    const lat = Number(latStr!.trim());

    if (isNaN(lat) || isNaN(lng)) {
        return next(
            new AppError(
                'Please provide correct coordinates - containing only numbers',
                400,
            ),
        );
    }

    return [lat, lng];
}

export function checkTimeFormat(time: string | undefined, next: NextFunction) {
    const onlyDigits = /^\d+:\d+$/;
    const regex = /\d{2}:\d{2}/; // 00:00

    if (!time) {
        return next(
            new AppError('Please provide a time property in format HH:mm', 400),
        );
    }

    if (onlyDigits.test(time)) {
        if (regex.test(time)) {
            return time;
        } else {
            const [hours, minutes] = time.split(':');

            const hours2Digit = hours!.length < 2 ? `0${hours}` : hours;

            return `${hours2Digit}:${minutes}`;
        }
    } else if (time.length <= 2) {
        const parsedHour = parseInt(time);

        if (parsedHour) {
            return `${parsedHour.toString().padStart(2, '0')}:00`;
        } else {
            return next(
                new AppError('Please provide correct time! Format: HH:mm', 400),
            );
        }
    } else {
        return next(new AppError('Wrong time format! Correct: HH:mm', 400));
    }
}

export function filterMass(
    day: ParamQuery,
    time: ParamQuery,
    next: NextFunction,
) {
    const massFilter: MassFilter = {};

    // Day default value 'sunday'
    massFilter.day = day
        ? Number(day) === 0
            ? 'sunday'
            : 'weekday'
        : 'sunday';

    if (time) {
        if (typeof time === 'object') {
            massFilter.time = {};

            for (const [op, value] of Object.entries(time)) {
                massFilter.time[`$${op}`] = checkTimeFormat(
                    value!.toString(),
                    next,
                );
            }
        } else {
            massFilter.time = checkTimeFormat(time, next);
        }
    }

    return massFilter;
}

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
                        $match: massFilter,
                    },
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
            $sort: { distance: 1 },
        },
    ]).limit(15);

    return churches;
}
