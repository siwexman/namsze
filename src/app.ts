import express from 'express';
import router from './routes/churchRoute';

const app = express();

app.use(express.json());

// ROUTES
app.get('/', router);

export default app;
