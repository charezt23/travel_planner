import 'dotenv/config';
import express from 'express';
import axios from 'axios';
const app = express();
app.use(express.json());
app.use(express.static('public'));

import { Client } from "@googlemaps/google-maps-services-js";
const googleMapsClient = new Client();
const googleCloudApiKey = process.env.GOOGLE_CLOUD_API_KEY;

async function generatePlanLLM(dest, days, budget, transportation) {
    const prompt = `
    Tolong buatkan rencana perjalanan wisata yang menarik dan realistis ke ${dest} selama ${days} hari dengan anggaran ${budget} Rupiah. Jenis transportasi utama yang akan digunakan adalah ${transportation}.

    Rencana perjalanan harus mencakup:
    - Aktivitas menarik untuk setiap hari.
    - Rekomendasi tempat makan yang sesuai dengan anggaran.
    - Saran transportasi lokal untuk berpindah antar tempat.
    - Perkiraan biaya untuk setiap aktivitas, makan, dan transportasi (jika memungkinkan).

    Output harus dalam format berikut:

    Hari ke-1:
    - Pagi: [Deskripsi aktivitas dan perkiraan biaya]
    - Siang: [Deskripsi aktivitas dan perkiraan biaya]
    - Sore: [Deskripsi aktivitas dan perkiraan biaya]
    - Malam: [Rekomendasi tempat makan dan perkiraan biaya]
    - Transportasi: [Saran transportasi dan perkiraan biaya]

    Hari ke-2:
    ...

    Total perkiraan biaya keseluruhan: [Jumlah total]

    Catatan Tambahan: [Informasi tambahan yang mungkin berguna, seperti tips atau hal yang perlu diperhatikan].

    Pastikan rencana ini masuk akal untuk ${days} hari dan sesuai dengan anggaran ${budget} Rupiah.
    `.trim();

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }], 
    });
    const response = await result.response;
    const generatedText = response.candidates[0].content.parts[0].text;
    return generatedText;
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    return 'Terjadi kesalahan saat membuat rencana perjalanan.';
  }
}

app.post('/generate-plan', async (req, res) => {
    try {
        const { destination, days, budget, transportation } = req.body;
        const plan = await generatePlanLLM(destination, days, budget, transportation);
        const coords = await geocode(destination);
        const weather = coords
            ? await getWeatherForecast(coords.lat, coords.lon, days)
            : null;

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
app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`));