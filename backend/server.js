backend/server.js

import express from 'express';
import { generatePlanLLM } from './ai.js';
import { geocode } from './geocode.js';
import { getWeatherForecast } from './weather.js';
import { findNearbyPlaces } from './places.js';

const app = express();
app.use(express.json());

app.post('/generate-plan', async (req, res) => {
    try {
        const { destination, days, budget, transportation } = req.body;
        const plan = await generatePlanLLM(destination, days, budget, transportation);
        const coords = await geocode(destination);
        const weather = coords ? await getWeatherForecast(coords.lat, coords.lon, days) : null;

        let nearbyRestaurants = [];
        let nearbyHotels = [];
        if (coords) {
            nearbyRestaurants = await findNearbyPlaces(coords.lat, coords.lon, "restaurant", "makanan");
            nearbyHotels = await findNearbyPlaces(coords.lat, coords.lon, "hotel");
        }

        res.json({ plan, weather, restaurants: nearbyRestaurants, hotels: nearbyHotels });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Server running at http://localhost:${PORT});
});