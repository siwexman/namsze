import { NextFunction } from 'express';
import { Schema, Document, model, Types } from 'mongoose';

export interface IMass extends Document {
    time: string;
    day: 'sunday' | 'weekday';
    description: string;
    church: Types.ObjectId;
}

const massSchema = new Schema<IMass>({
    time: {
        type: String,
        required: [true, 'A mass must have a time (HH:MM)'],
        validate: {
            validator: (v: string) =>
                /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(v),
            message: 'Time must be in HH:mm format (e.g. 09:30)',
        },
    },
    day: {
        type: String,
        enum: ['sunday', 'weekday'],
        default: 'sunday',
    },
    description: {
        type: String,
    },
    church: {
        type: Types.ObjectId,
        ref: 'Church',
        required: true,
    },
});

massSchema.index({ church: 1 });

export const Mass = model<IMass>('Mass', massSchema);
