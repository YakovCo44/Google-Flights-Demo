import axios from "axios"
import { getAirportCoordinates } from "./getAirportCoordinates.js"

// Load API credentials from .env
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY
const API_HOST = "sky-scrapper.p.rapidapi.com"

// Create a common axios instance
const apiClient = axios.create({
    baseURL: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights',
    headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST
    }
})

// ✅ Function to check if the API server is online
export const checkServerStatus = async () => {
    try {
        const response = await apiClient.get("checkServer")
        return response.data
    } catch (error) {
        console.error("❌ API Error:", error)
        return null
    }
}

// ✅ Function to search for flights
export async function searchFlights(departure, arrival, departureDate, returnDate, adults = 1, children = 0) {
    console.log(`🚀 Fetching flights: ${departure?.iata} → ${arrival?.iata}, ${departureDate} → ${returnDate}, Passengers: ${adults + children}`)

    if (!departure?.iata || !arrival?.iata) {
        console.error("❌ Missing departure or arrival airport IATA code")
        return { flights: [] }
    }

    // ✅ Mock flight data (fallback) Too much use of API
    const mockFlights = [
        {
            price: 250,
            airline: "El Al",
            airline_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/El_Al_Logo.svg/2560px-El_Al_Logo.svg.png",
            flights: [
                {
                    departure_date: departureDate,
                    airline: "El Al",
                    airline_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/El_Al_Logo.svg/2560px-El_Al_Logo.svg.png",
                    departure_time: "08:30 AM",
                    arrival_time: "11:45 AM",
                    duration: { text: "3h 15m" },
                    departure_airport_lat: 32.0, departure_airport_lng: 34.8,  // Tel Aviv (TLV)
                    arrival_airport_lat: 37.9, arrival_airport_lng: 23.7 // Athens (ATH)
                },
                {
                    departure_date: returnDate || "Unknown Date",
                    airline: "El Al",
                    airline_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/El_Al_Logo.svg/2560px-El_Al_Logo.svg.png",
                    departure_time: "04:00 PM",
                    arrival_time: "07:20 PM",
                    duration: { text: "3h 20m" },
                    departure_airport_lat: 37.9, departure_airport_lng: 23.7, // Athens (ATH)
                    arrival_airport_lat: 32.0, arrival_airport_lng: 34.8  // Tel Aviv (TLV)
                }
            ]
        },
        {
            price: 300,
            airline: "Aegean Airlines",
            airline_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Aegean_Airlines_Logo.svg/2560px-Aegean_Airlines_Logo.svg.png",
            flights: [
                {
                    departure_date: departureDate,
                    airline: "Aegean Airlines",
                    airline_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Aegean_Airlines_Logo.svg/2560px-Aegean_Airlines_Logo.svg.png",
                    departure_time: "10:00 AM",
                    arrival_time: "01:10 PM",
                    duration: { text: "3h 10m" },
                    departure_airport_lat: 32.0, departure_airport_lng: 34.8, // Tel Aviv (TLV)
                    arrival_airport_lat: 37.9, arrival_airport_lng: 23.7  // Athens (ATH)
                },
                {
                    departure_date: returnDate || "Unknown Date",
                    airline: "Aegean Airlines",
                    airline_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Aegean_Airlines_Logo.svg/2560px-Aegean_Airlines_Logo.svg.png",
                    departure_time: "06:15 PM",
                    arrival_time: "09:30 PM",
                    duration: { text: "3h 15m" },
                    departure_airport_lat: 37.9, departure_airport_lng: 23.7, // Athens (ATH)
                    arrival_airport_lat: 32.0, arrival_airport_lng: 34.8  // Tel Aviv (TLV)
                }
            ]
        }
    ]    

    // ✅ API request options
    const options = {
        method: "GET",
        url: `https://${process.env.REACT_APP_RAPIDAPI_HOST}/searchFlights`,
        params: {
            departure_id: departure.iata,
            arrival_id: arrival.iata,
            outbound_date: departureDate,
            ...(returnDate ? { return_date: returnDate } : {}), 
            travel_class: "ECONOMY",
            adults, 
            children, 
            currency: "USD",
            language_code: "en-US",
            country_code: "US"
        },
        headers: {
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST
        }
    }

    try {
        const response = await axios.request(options)
        console.log("📡 API Response:", response.data)

        // ✅ If API returns empty, use mock flights
        if (!response.data?.flights || response.data.flights.length === 0) {
            console.warn("⚠️ API returned no flights. Using mock data as fallback.")
            return { flights: mockFlights }
        }

        return { flights: response.data.flights }
    } catch (error) {
        console.error("❌ API call failed. Using mock data instead.", error.message)

        return { flights: mockFlights } // ✅ Fallback to mock data if API fails
    }
}

// ✅ Function to search for airports (autocomplete)
export async function searchAirports(query) {
    if (!query) return []

    const options = {
        method: "GET",
        url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights',
        params: { query, locale: "en-US" },
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST
        }
    }

    console.log(`🔍 Searching Airports for query: "${query}"`)

    try {
        const response = await axios.request(options)
        console.log("🔍 Full API Response:", response.data)

        return response.data?.data?.map(airport => ({
            iata: airport.skyId || "Unknown",
            name: airport.presentation?.title || "Unknown Airport",
            country: airport.presentation?.subtitle || "Unknown Country",
            location: {
                lat: airport.geo?.lat || null,
                lng: airport.geo?.lng || null
            }
        })) || []
    } catch (error) {
        console.error("❌ Error fetching airports:", error)
        return []
    }
}
