import express from 'express';
import connectDB from './config/db';

const app = express();

connectDB();

app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
    res.send('API is running with TypeScript and MongoDB!');
});

export default app;
