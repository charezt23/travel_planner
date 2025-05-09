document.addEventListener('DOMContentLoaded', () => {
    const travelForm = document.getElementById('travelForm');
    travelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const budget = document.getElementById('budget').value;
        const destination = document.getElementById('destination').value;
        const transportation = document.getElementById('transportation').value;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        document.getElementById('days').value = days;
        try {
            const response = await fetch('/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, days, budget, transportation }),
            });
            const data = await response.json();
            let outputHTML = `
                <div class="plan-output">${marked.parse(data.plan)}</div>
                <h3>Prediksi Cuaca:</h3>
            `;
            if (data.weather && data.weather.time && data.weather.time.length > 0) {
                outputHTML += '<div class="weather-cards">';
                data.weather.time.forEach((dateStr, index) => {
                    const date = new Date(dateStr);
                    const dayOfWeek = date.toLocaleDateString('id-ID', { weekday: 'long' });
                    const formattedDate = date.toLocaleDateString();
                    const maxTemperature = data.weather.temperature_2m_max[index];
                    const minTemperature = data.weather.temperature_2m_min[index];
                    const description = data.weather.weathercode[index] || "Informasi cuaca tidak tersedia";

                    outputHTML += `
                        <div class="weather-card">
                          <h4>${dayOfWeek}</h4>
                          <p class="date">${formattedDate}</p>
                          <p class="description">${description}</p>
                          <p class="temperature">${minTemperature}°C - ${maxTemperature}°C</p>
                        </div>
                    `;
                });
                outputHTML += '</div>';
            } else {
                outputHTML += <p>Prediksi cuaca tidak tersedia.</p>;
            }
            if (data.restaurants && data.restaurants.length > 0) {
                outputHTML += <h3>Rekomendasi Tempat Makan Terdekat:</h3><ul class="restaurants-list">;
                data.restaurants.forEach(restaurant => {
                    const mapsUrl = https://www.google.com/maps/place/?q=place_id:${restaurant.place_id};
                    outputHTML += <li><strong>${restaurant.name}</strong> - ${restaurant.vicinity} <a href="${mapsUrl}" target="_blank">Lihat di Peta</a></li>;
                });
                outputHTML += </ul>;
            }
            if (data.hotels && data.hotels.length > 0) {
                outputHTML += <h3>Rekomendasi Hotel Terdekat:</h3><ul class="hotels-list">;
                data.hotels.forEach(hotel => {
                    const mapsUrl = https://www.google.com/maps/place/?q=place_id:${hotel.place_id};
                    outputHTML += <li><strong>${hotel.name}</strong> - ${hotel.vicinity} <a href="${mapsUrl}" target="_blank">Lihat di Peta</a></li>;
                });
                outputHTML += </ul>;
            }
            document.getElementById('output').innerHTML = outputHTML;
        } catch (error) {
            alert('Terjadi kesalahan: ' + error.message);
        }
    });
});
