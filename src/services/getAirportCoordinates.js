export async function getAirportCoordinates(airportCode) {
    try {
        const apiUrl = `https://${process.env.REACT_APP_RAPIDAPI_HOST}/airport/${airportCode}`
        console.log(`🌍 Fetching coordinates for ${airportCode} from API:`, apiUrl) // ✅ Debugging

        const response = await fetch(apiUrl, { 
            headers: { "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY } 
        })

        const data = await response.json()
        console.log("📍 API Response for Airport Coordinates:", data) // ✅ Log full response

        if (data?.data?.length > 0 && data.data[0]?.geo) {
            return {
                lat: data.data[0].geo.lat,
                lng: data.data[0].geo.lng
            }
        } else {
            console.warn(`⚠️ No valid coordinates found for ${airportCode}`)
            return { lat: null, lng: null }
        }
    } catch (error) {
        console.error(`❌ Error fetching coordinates for ${airportCode}:`, error)
        return null 
    }    
}


