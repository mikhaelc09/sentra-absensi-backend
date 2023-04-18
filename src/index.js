import express from 'express';
import * as dotenv from 'dotenv';
import {router} from './routes/index.js';
import { init } from './models/index.js';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use('/api/v1', router)

app.listen(PORT, async () => {
    await init();
    console.log(`Listening on port ${PORT}`);
})