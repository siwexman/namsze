import express from 'express';
import churchRouter from './routes/churchRoute';
import massRouter from './routes/massRoute';
import confessionRouter from './routes/confessionRoute';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());
app.options('*', cors());

// ROUTES
app.use('/api/v1/churches', churchRouter);
app.use('/api/v1/masses', massRouter);
app.use('/api/v1/confessions', confessionRouter);

export default app;
