import express from 'express';
import churchRouter from './routes/churchRoute';
import massRouter from './routes/massRoute';

const app = express();

app.use(express.json());

// ROUTES
app.use('/api/v1/churches', churchRouter);
app.use('/api/v1/masses', massRouter);

export default app;
