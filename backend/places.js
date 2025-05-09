import { Client } from "@googlemaps/google-maps-services-js";

const googleMapsClient = new Client();
const googleCloudApiKey = process.env.GOOGLE_CLOUD_API_KEY;

export async function findNearbyPlaces(latitude, longitude, type, query = "") {
    if (!googleCloudApiKey) {
        console.warn("Google Cloud API key tidak ditemukan. Fitur tempat terdekat tidak akan berfungsi.");
        return [];
    }

    let radius = 1000;
    let keyword = query;

    if (type === "hotel") {
        radius = 5000;
        keyword = "hotel";
    }

    try {
        const response = await googleMapsClient.placesNearby({
            params: {
                location: { lat: latitude, lng: longitude },
                radius: radius,
                type: type,
                keyword: keyword,
                key: googleCloudApiKey,
            },
            timeout: 1000,
        });

        let results = response.data.results;
        if (type === "hotel") {
            results = results.filter(result => !result.types.includes("school") && !result.types.includes("university"));
        }

        return results.map(result => ({
            name: result.name,
            vicinity: result.vicinity,
            place_id: result.place_id 
        }));
    } catch (error) {
        console.error(`Gagal mencari tempat terdekat bertipe ${type}:`, error);
        return [];
    }
}
