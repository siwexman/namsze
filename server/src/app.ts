import express from 'express';
import churchRouter from './routes/churchRoute';
import massRouter from './routes/massRoute';
import userRouter from './routes/userRoute';
import confessionRouter from './routes/confessionRoute';
import cookieParser from 'cookie-parser';
// @ts-ignore
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import path from 'path';
import multer from 'multer';

const app = express();

const storage = multer.diskStorage({
    destination: 'images/',
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase(),
        );

        if (mimetype && extname) return cb(null, true);
        cb(new Error('Tylko obrazy są dozwolone!'));
    },
});

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

app.use(cors());
app.options('*', cors());

// ROUTES
app.use('/api/v1/churches', churchRouter);
app.use('/api/v1/masses', massRouter);
app.use('/api/v1/confessions', confessionRouter);
app.use('/api/v1/user', userRouter);

app.use(
    '/api/v1/churches/images',
    express.static(path.join(__dirname, 'public', 'images')),
);

export default app;
