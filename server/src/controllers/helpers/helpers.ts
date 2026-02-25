import { NextFunction, Request } from 'express';
import { MassFilter, ParamQuery } from './types';
import { AppError } from '../../utils/appError';
import { PipelineStage } from 'mongoose';

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
    massFilter.dayOfWeek = day ? Number(day) : 0;

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

export function getChurchesPipline(req: Request, next: NextFunction) {
    const { time } = req.params;
    const { day, city, coords, radius } = req.query;

    if (!city && !coords) {
        next(new AppError('Please provide coordinates or city!', 404));
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

    return {
        pipelineChurch,
        pipelineTime,
        massFilter,
    };
}
