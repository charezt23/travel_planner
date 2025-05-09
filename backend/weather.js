import axios from 'axios';

export async function getWeatherForecast(lat, lon, days) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia/Jakarta&forecast_days=${days}`.replace(/\s+/g, '');
    const { data } = await axios.get(url);
    return data.daily;
}
