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

const app = express();

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

export default app;
