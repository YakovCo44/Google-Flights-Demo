import React from "react"
import { Typography, Paper, Grid, Card, CardContent, CardMedia, Divider } from "@mui/material"

const FlightList = ({ flights, adults, children, tripType }) => {
    if (!flights || flights.length === 0) {
        return <Typography variant="h6" textAlign="center">No flights found.</Typography>
    }

    return (
        <>
            {/* Heading on Top */}
            <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center" sx={{ marginBottom: 2 }}>
                ✈️ Available Flights
            </Typography>

            {/* Flight List Container */}
            <Paper elevation={4} sx={{ padding: 3, borderRadius: 2, width: "100%", boxShadow: 5 }}>
                <Grid container spacing={2} justifyContent="center" sx={{ width: "100%", marginTop: 2 }}>
                    {flights.map((flight, index) => {
                        const airline = flight.airline || "Unknown Airline"
                        const totalPassengers = (Number(adults) || 1) + (Number(children) || 0)
                        const pricePerPassenger = flight.price
                            ? `${(flight.price / totalPassengers).toFixed(2)} USD per passenger`
                            : "Price Unavailable"

                        // ✅ Corrected Logo Handling
                        const logo = flight.airline_logo?.startsWith("http")
                            ? flight.airline_logo
                            : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"

                        return (
                            <Grid item xs={12} key={index} sx={{ width: "100%" }}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        padding: 3,
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        backgroundColor: "#f9f9f9",
                                        width: "95%",
                                        margin: "auto"
                                    }}
                                >
                                    {/* Airline Info */}
                                    <Grid container alignItems="center">
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 80, height: 80, marginRight: 2, objectFit: "contain", borderRadius: 1 }}
                                            image={logo}
                                            alt={`${airline} Logo`}
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                                            }}
                                        />
                                        <Typography variant="h6" fontWeight="bold">
                                            {airline}
                                        </Typography>
                                    </Grid>

                                    <Typography variant="body1" color="green" fontWeight="bold" sx={{ marginBottom: 1 }}>
                                        {pricePerPassenger}
                                    </Typography>

                                    {/* Display Only Outbound Flight */}
                                    {flight.flights.length > 0 && (
                                        <CardContent sx={{ textAlign: "left", flexGrow: 1, paddingBottom: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                                Outbound Flight
                                            </Typography>
                                            <Typography variant="body2">📅 <b>Date:</b> {flight.flights[0].departure_date}</Typography>
                                            <Typography variant="body2">🛫 <b>Departure:</b> {flight.flights[0].departure_time}</Typography>
                                            <Typography variant="body2">🛬 <b>Arrival:</b> {flight.flights[0].arrival_time}</Typography>
                                            <Typography variant="body2">⏳ <b>Duration:</b> {flight.flights[0].duration.text}</Typography>
                                        </CardContent>
                                    )}

                                    {/* Display Return Flight ONLY if Round Trip */}
                                    {tripType === "round-trip" && flight.flights?.length > 1 && flight.flights[1] && (
                                        <>
                                            <Divider sx={{ marginY: 1 }} />
                                            <CardContent sx={{ textAlign: "left", flexGrow: 1, paddingBottom: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                                    Return Flight
                                                </Typography>
                                                <Typography variant="body2">📅 <b>Date:</b> {flight.flights[1].departure_date}</Typography>
                                                <Typography variant="body2">🛫 <b>Departure:</b> {flight.flights[1].departure_time}</Typography>
                                                <Typography variant="body2">🛬 <b>Arrival:</b> {flight.flights[1].arrival_time}</Typography>
                                                <Typography variant="body2">⏳ <b>Duration:</b> {flight.flights[1].duration.text}</Typography>
                                            </CardContent>
                                        </>
                                    )}
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </Paper>
        </>
    )
}

export default FlightList
