import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';

import { Church, IChurch } from '../models/ChurchModel';
import { Mass } from '../models/MassModel';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function importData() {
    try {
        const connectionString = `mongodb://${process.env.MONGO_USERNAME}:${
            process.env.MONGO_PASSWORD
        }@${process.env.HOST_SERVER || 'localhost'}:${
            process.env.DATABASE_PORT
        }/${process.env.MONGO_DATABASE}`;

        console.log(connectionString);

        await mongoose.connect(connectionString);
        console.log('Connected to DB');

        const jsonFile = fs.readFileSync(
            path.join(__dirname, 'church.json'),
            'utf-8'
        );
        const churchArray = JSON.parse(jsonFile);

        // Clear old data
        await Church.deleteMany({});
        await Mass.deleteMany({});

        for (const church of churchArray) {
            const { masses, ...churchData } = church;

            const newChurch = (await Church.create(
                churchData
            )) as unknown as IChurch;
            console.log(`Imported church: ${newChurch.name}`);

            if (masses && masses.length > 0) {
                const massesWID = masses.map((m: any) => ({
                    ...m,
                    church: newChurch._id,
                }));

                await Mass.insertMany(massesWID);
                console.log(`-> Added ${masses.length} masses`);
            }
        }

        console.log('Import finished!');
        process.exit();
    } catch (error) {
        console.log('Import Error:', error);
        process.exit(1);
    }
}

importData();
