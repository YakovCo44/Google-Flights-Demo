import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { searchFlights } from "../services/apiservice"
import FlightList from "../components/FlightList"
import FlightMap from "../components/FlightMap"
import { Container, Grid, Paper, Typography, CircularProgress, Button } from "@mui/material"

const ResultsPage = () => {
    const location = useLocation()
    const navigate = useNavigate()

    if (!location.state) {
        console.error("❌ Missing state in ResultsPage! Redirecting to home...")
        navigate("/")
        return null
    }

    const {
        departure,
        arrival,
        formattedDepartureDate,
        formattedReturnDate,
        tripType,
        adults,
        children
    } = location.state

    const [flights, setFlights] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!departure || !arrival || !formattedDepartureDate) {
            setLoading(false)
            return
        }

        let isMounted = true

        const fetchFlights = async () => {
            console.log(`🚀 Fetching flights: ${departure.iata} → ${arrival.iata}, ${formattedDepartureDate} → ${formattedReturnDate}`)

            try {
                const flightData = await searchFlights(
                    departure, arrival, formattedDepartureDate, formattedReturnDate, adults, children
                )

                console.log("📡 API Response:", flightData)

                if (isMounted) {
                    setFlights(flightData.flights || [])
                    setLoading(false)
                }
            } catch (error) {
                console.error("❌ Error fetching flights:", error)
                setLoading(false)
            }
        }

        fetchFlights()

        return () => {
            isMounted = false
        }
    }, [departure, arrival, formattedDepartureDate, formattedReturnDate, adults, children])

    // ✅ Define `firstFlight` before using it
    const firstFlight = flights.length > 0 ? flights[0] : null
    const firstLeg = firstFlight?.flights?.[0] || null
    
    const departureCoords = firstLeg ? { lat: firstLeg.departure_airport_lat, lng: firstLeg.departure_airport_lng } : null
    const arrivalCoords = firstLeg ? { lat: firstLeg.arrival_airport_lat, lng: firstLeg.arrival_airport_lng } : null           

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            {/* 🔄 Back to Search Button */}
            <Button 
                variant="contained" 
                color="primary" 
                sx={{ marginBottom: 2 }}
                onClick={() => navigate("/")}
            >
                🔄 Back to Search
            </Button>

            <Typography variant="h4" gutterBottom textAlign="center" sx={{ marginBottom: 2 }}>
                {tripType === "round-trip" ? "Round-Trip Flight" : "One-Way Flight"} Results - {adults + children} Passenger{(adults + children) > 1 ? "s" : ""}
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : flights.length === 0 ? (
                <Typography color="error">No flights found.</Typography>
            ) : (
                <Grid container spacing={8} sx={{ alignItems: "flex-start", justifyContent: "center"}}>
                    {/* Flight Route */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center" sx={{ marginBottom: 2 }}>
                            🗺️ Flight Route
                        </Typography>
                        <Paper elevation={4} sx={{ padding: 3, borderRadius: 2, width: "100%", boxShadow: 5 }}>
                            {departureCoords && arrivalCoords ? (
                                <FlightMap departureCoords={departureCoords} arrivalCoords={arrivalCoords} />
                            ) : (
                                <Typography color="error">Error: Missing airport coordinates. Please try another search.</Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* Flight List */}
                    <Grid item xs={12} md={6}>
                        <FlightList flights={flights} adults={adults} children={children} tripType={tripType} />
                    </Grid>
                </Grid>
            )}
        </Container>
    )
}

export default ResultsPage
