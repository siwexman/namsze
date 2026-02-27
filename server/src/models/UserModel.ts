import { Schema, Document, model, ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/appError';

export interface IUser extends Document {
    name: string;
    password: string;
    role: string;
    // email: string;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide a name'],
        match: [/^[a-zA-Z\s.]+$/, 'A name can can only contains letters'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        default: 'user',
    },
});

userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

export const User = model<IUser>('User', userSchema);
