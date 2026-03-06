import app from './app';
import connectDB from './config/db';

const PORT = process.env.SERVER_PORT || '3000';
const HOST = '0.0.0.0';

connectDB();

app.listen(Number(PORT), HOST, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server is working on http://${HOST}:${PORT}`);
});
