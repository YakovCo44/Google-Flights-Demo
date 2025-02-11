import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { searchAirports } from "../services/apiservice"
import { TextField, Button, Container, Typography, Grid, Paper, Autocomplete, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

const HomePage = () => {
    const navigate = useNavigate()

    const [adults, setAdults] = useState(1)  // Default to 1 adult
    const [children, setChildren] = useState(0)  // Default to 0 children
    
    // ✅ Correct placement of hooks inside the component function
    const [tripType, setTripType] = useState("one-way")
    const [departureDate, setDepartureDate] = useState(null)
    const [returnDate, setReturnDate] = useState(null)
    const [departure, setDeparture] = useState(null)
    const [arrival, setArrival] = useState(null)
    const [departureOptions, setDepartureOptions] = useState([])
    const [arrivalOptions, setArrivalOptions] = useState([])

    // Fetch airport suggestions when typing
    const handleAirportSearch = async (query, setOptions) => {
        if (query.length > 2) {
            const airports = await searchAirports(query)
            setOptions(airports)
        }
    }

    // Handle search button click
    const handleSearch = async (event) => {
        event.preventDefault()
        if (!departure || !arrival || !departureDate) {
            alert("Please select all required fields.")
            return
        }

        const formatDate = (date) => {
            if (!date) return null
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const day = String(date.getDate()).padStart(2, "0")
            return `${year}-${month}-${day}`
        }

        const formattedDepartureDate = formatDate(departureDate)
        const formattedReturnDate = formatDate(returnDate)

        // Navigate to ResultsPage with selected data
        navigate("/results", {
            state: {
                departure,
                arrival,
                departureCoords: departure?.geo || departure?.location || null, // ✅ Ensure coordinates exist
                arrivalCoords: arrival?.geo || arrival?.location || null,
                formattedDepartureDate,
                formattedReturnDate: tripType === "round-trip" ? formattedReturnDate : null,
                tripType,
                adults,
                children
            }
        })                        
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="md">
                <Paper elevation={3} style={{ padding: 20, marginTop: 20, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>Google Flights Demo</Typography>

                    {/* Search Form */}
                    <form onSubmit={handleSearch}>
                        <Grid container spacing={2} justifyContent="center">
                            {/* Departure Airport */}
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    options={departureOptions}
                                    getOptionLabel={(option) => option.name && option.iata ? `${option.name} (${option.iata})` : "Unknown Airport"}
                                    onInputChange={(event, newInputValue) => handleAirportSearch(newInputValue, setDepartureOptions)}
                                    onChange={(event, newValue) => setDeparture(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Departure Airport" fullWidth required />}
                                />
                            </Grid>

                            {/* Arrival Airport */}
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    options={arrivalOptions}
                                    getOptionLabel={(option) => option.name && option.iata ? `${option.name} (${option.iata})` : "Unknown Airport"}
                                    onInputChange={(event, newInputValue) => handleAirportSearch(newInputValue, setArrivalOptions)}
                                    onChange={(event, newValue) => setArrival(newValue)}
                                    renderInput={(params) => <TextField {...params} label="Arrival Airport" fullWidth required />}
                                />
                            </Grid>

                            {/* Departure Date Picker */}
                            <Grid item xs={12} sm={4}>
                                <DatePicker
                                    label="Departure Date"
                                    value={departureDate}
                                    onChange={(newValue) => setDepartureDate(newValue)}
                                    minDate={new Date()}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>

                            {/* Trip Type Selection */}
                            <Grid item xs={12} sm={4}>
                                <FormLabel component="legend">Trip Type</FormLabel>
                                <RadioGroup row value={tripType} onChange={(e) => setTripType(e.target.value)}>
                                    <FormControlLabel value="one-way" control={<Radio />} label="One-Way" />
                                    <FormControlLabel value="round-trip" control={<Radio />} label="Round-Trip" />
                                </RadioGroup>
                            </Grid>

                            {/* Return Date Picker - Disabled for One-Way */}
                            <Grid item xs={12} sm={4}>
                                <DatePicker
                                    label="Return Date"
                                    value={returnDate}
                                    onChange={(newValue) => setReturnDate(newValue)}
                                    minDate={departureDate || new Date()}
                                    disabled={tripType === "one-way"}  // Disable when one-way is selected
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                        </Grid>
                        {/* Passenger Selection */}
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Adults"
                                    type="number"
                                    inputProps={{ min: 1 }}  // Minimum 1 adult
                                    value={adults}
                                    onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Children"
                                    type="number"
                                    inputProps={{ min: 0 }}  // Minimum 0 children
                                    value={children}
                                    onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                                    fullWidth
                                />
                            </Grid>
                        {/* Search Button */}
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
                            Search Flights
                        </Button>
                    </form>
                </Paper>
            </Container>
        </LocalizationProvider>
    )
}

export default HomePage
