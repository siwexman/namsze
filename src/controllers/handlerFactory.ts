import { Model } from 'mongoose';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { APIFeatures } from '../utils/apiFeatures';
import { Church, IChurch } from '../models/ChurchModel';
import axios from 'axios';

type PopOptions = { path: string };

type MassFilter = {
    day?: string;
    time?: any;
    radius?: number;
};

export const getOne = <T>(
    Model: Model<T>,
    popOptions?: PopOptions,
    paramName = 'id'
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

export const getNearChurchesWithMasses = catchAsync(async (req, res, next) => {
    const { latlng } = req.params;
    const { radius, day, time } = req.query;

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
                massFilter.time[`$${op}`] = value;
            }
        } else {
            massFilter.time = time;
        }
    }

    // Radius default value 5 km
    const queryRadius = radius ? Number(radius.toString()) : 5;

    if (!latlng) {
        return next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng',
                404
            )
        );
    }
    const [latStr, lngStr] = latlng.split(',');

    const lng = Number(lngStr!.trim());
    const lat = Number(latStr!.trim());
    const coordsStr = `${lng},${lat}`;

    if (isNaN(lat) || isNaN(lng)) {
        return next(
            new AppError(
                'Please provide correct coordinates - containing only numbers',
                404
            )
        );
    }

    const nearestChurches = await getChurchesWithin(
        lng,
        lat,
        queryRadius,
        massFilter
    );

    const docs = await Promise.all(
        nearestChurches.map(async church => fetchAllData(church, coordsStr))
    );

    res.status(200).json({
        results: docs.length,
        data: {
            data: docs,
        },
    });
});

// Coordinates !(longitude,latitude)!
async function fetchAllData(church: IChurch, startLocation: string) {
    try {
        const orsRes = await axios.get(
            `https://api.openrouteservice.org/v2/directions/driving-car`,
            {
                params: {
                    api_key: process.env.OPENROUTESERVICE_API_KEY,
                    start: startLocation,
                    end: church.location.coordinates.join(','),
                },
            }
        );

        return {
            ...church,
            distanceFromUser:
                orsRes.data.features[0].properties.summary.distance, // distance in meters
            duration: orsRes.data.features[0].properties.summary.duration, // duration in seconds
            route: orsRes.data.features[0].geometry, // GeoJSON for the path
        };
    } catch (error) {
        return { name: church.name, error: 'Route not found' };
    }
}

async function getChurchesWithin(
    lng: number,
    lat: number,
    radius: number,
    massFilter: MassFilter
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
    ]);

    return churches;
}
