import { model, Schema, Types, Document } from 'mongoose';

export interface IRecurringConfession extends Document {
    dayOfWeek: number; // 0 - 6 (sunday - saturday)
    startTime: string; // HH:mm format
    endTime: string;
    church: Types.ObjectId;
}

export interface ISingleConfession extends Document {
    startTime?: Date;
    expireAt: Date;
    church: Types.ObjectId;
    // reportedBy: Types.ObjectId  -- user
}

const recurringConfessionSchema = new Schema<IRecurringConfession>(
    {
        dayOfWeek: {
            type: Number,
            required: [true, 'A recurring confession must have a day'],
            match: [/^[0-6]/, 'A confession can only cantain number 0 - 6'],
        },
        startTime: {
            type: String,
            required: [true, 'A confession must have a start time (HH:mm)'],
            validate: {
                validator: (v: string) =>
                    /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(v),
                message: 'Time must be in HH:mm format (e.g. 09:30)',
            },
        },
        endTime: {
            type: String,
            required: [true, 'A confession must have a end time (HH:mm)'],
            validate: {
                validator: function (this: any, v: string): boolean {
                    if (this.startTime === v) {
                        return false;
                    }

                    return this.startTime < v;
                },
                message: 'End Time must be grater than start Time',
            },
        },
        church: {
            type: Types.ObjectId,
            ref: 'Church',
            required: true,
        },
    },
    {
        collection: 'recurringConfessions',
    },
);

const singleConfessionSchema = new Schema<ISingleConfession>(
    {
        startTime: {
            type: Date,
            validate: {
                validator: function (this: any, v: string): boolean {
                    if (this.expireAt && v < this.expireAt) {
                        return true;
                    }

                    return false;
                },
                message: 'Start Time must be earlier than expire time!',
            },
        },
        expireAt: {
            type: Date,
            default: Date.now() + 30 * 60 * 1000, // +30 min
            required: [true, 'A live confession must have a datetime'],
        },
        church: {
            type: Types.ObjectId,
            ref: 'Church',
            required: true,
        },
    },
    {
        collection: 'singleConfessions',
    },
);

singleConfessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const RecurringConfession = model<IRecurringConfession>(
    'RecurringConfession',
    recurringConfessionSchema,
);

export const SingleConfession = model<ISingleConfession>(
    'SingleConfession',
    singleConfessionSchema,
);
