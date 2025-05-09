import axios from 'axios';

export async function geocode(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`.replace(/\s+/g, '');
    const { data } = await axios.get(url);
    console.log("Hasil geocode:", data);
    return data.results?.[0]
        ? { lat: data.results[0].latitude, lon: data.results[0].longitude }
        : null;
}
