// @ts-nocheck
import jwt from 'jsonwebtoken';
import { User } from '../models/UserModel';
import { Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { promisify } from 'util';

const signToken = (id: string) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        return;
    }

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d',
    });

    return token;
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() +
                (Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90) *
                    24 *
                    60 *
                    60 *
                    1000,
        ),
        httpOnly: true,
    };

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return next(new AppError('Please provide name or password!', 400));
    }

    const user = await User.findOne({ name }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect name or password!', 401));
    }

    createSendToken(user, 200, res);
});

export const restrictTo =
    (...roles) =>
    (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403,
                ),
            );
        }

        next();
    };

export const protect = catchAsync(async (req, res, next) => {
    // 1) Geting token and check if its there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please login to get access.',
                401,
            ),
        );
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exists.',
                401,
            ),
        );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401,
            ),
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

export const isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) Verifies token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET,
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);

            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        } catch (error) {
            return next();
        }
    }

    next();
};
