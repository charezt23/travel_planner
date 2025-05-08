import 'dotenv/config';
import express from 'express';
import axios from 'axios';
const app = express();
app.use(express.json());
app.use(express.static('public'));

import { Client } from "@googlemaps/google-maps-services-js";
const googleMapsClient = new Client();
const googleCloudApiKey = process.env.GOOGLE_CLOUD_API_KEY;

app.listen(3000, () =>
    console.log(`Server running at http://localhost:3000`)
);