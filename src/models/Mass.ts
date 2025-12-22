import mongoose, { Schema, Document, model, Types } from 'mongoose';

export interface IMass extends Document {
    time: string;
    day: 'sunday' | 'weekday';
    description: string;
    parrish: Types.ObjectId;
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
    parrish: {
        type: Types.ObjectId,
        ref: 'Parrish',
        required: true,
    },
});

massSchema.pre<IMass>('validate', async function (this: IMass) {
    if (
        this.time &&
        typeof this.isModified === 'function' &&
        this.isModified('time')
    ) {
        const timeParts = this.time.trim().split(':');

        if (timeParts.length === 2) {
            const hours = timeParts[0]?.padStart(2, '0');
            const minutes = timeParts[1]?.padStart(2, '0');

            this.time = `${hours}:${minutes}`;
        }
    }
});

export const Mass = model<IMass>('Mass', massSchema);
