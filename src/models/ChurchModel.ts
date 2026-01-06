import { NextFunction } from 'express';
import { Schema, Document, model } from 'mongoose';

export interface IChurch extends Document {
    name: string;
    city: string;
    address: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    isCathedral?: boolean;
    image: string;
}

const churchSchema = new Schema<IChurch>(
    {
        // dedicated to = pod wezwaniem
        name: {
            type: String,
            required: [true, 'A church must have a dedication/name'],
            trim: true,
            match: [
                /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s.]+$/,
                'A church can only contain letters',
            ],
        },
        city: {
            type: String,
            required: [true, 'A church must have a city'],
            trim: true,
        },
        // street number || number (if no street)
        address: {
            type: String,
            required: [true, 'A church must have a address'],
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
                required: [true, 'A church must have a location'],
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

churchSchema.index({ location: '2dsphere' });

churchSchema.virtual('masses', {
    ref: 'Mass',
    localField: '_id',
    foreignField: 'church',
    options: { sort: { day: 1, time: 1 } },
});

churchSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        const masses = await model('Mass').deleteMany({ church: doc._id });

        console.log(
            `Deleted church ${doc._id} with ${masses.deletedCount} masses`
        );
    }

    next();
});

export const Church = model<IChurch>('Church', churchSchema);
