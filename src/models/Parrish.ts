import { Schema, Document, Types, model } from 'mongoose';

import { IMass } from './Mass';

interface IParrish extends Document {
    dedicatedTo: string;
    city: string;
    address: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    isCathedral?: boolean;
    image: string;
    masses?: IMass[];
}

const parrishSchema = new Schema<IParrish>(
    {
        // dedicated to = pod wezwaniem
        dedicatedTo: {
            type: String,
            required: [true, 'A parrish must have a dedication'],
            trim: true,
            match: [/^[a-zA-Z\s]+$/, 'A parrish can only contain letters'],
        },
        city: {
            type: String,
            required: [true, 'A parrish must have a city'],
            trim: true,
        },
        // street number || number (if no street)
        address: {
            type: String,
            required: [true, 'A parrish must have a address'],
        },
        location: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                required: [true, 'A parrish must have a location'],
            },
        },
        isCathedral: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

parrishSchema.index({ location: '2dsphere' });

parrishSchema.virtual('mass', {
    ref: 'Mass',
    localField: '_id',
    foreignField: 'parrish',
    options: { sort: { time: 1 } },
});

export const Parrish = model<IParrish>('Parrish', parrishSchema);
