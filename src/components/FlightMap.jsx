import React, { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Typography } from "@mui/material"

// Fix missing Leaflet icons in React
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

// Component to center the map on new coordinates
const MapUpdater = ({ center }) => {
    const map = useMap()
    useEffect(() => {
        map.setView(center, 4) // Adjust zoom level
        setTimeout(() => {
            map.invalidateSize() // Fix rendering issues
        }, 500)
    }, [center, map])
    return null
}

const FlightMap = ({ departureCoords, arrivalCoords }) => {
    const isValidCoords = (coords) => coords && typeof coords.lat === "number" && typeof coords.lng === "number"

    console.log("📌 FlightMap received departureCoords:", departureCoords)
    console.log("📌 FlightMap received arrivalCoords:", arrivalCoords)


    // Default to New York if no valid coordinates
    const centerPosition = isValidCoords(departureCoords) && isValidCoords(arrivalCoords)
        ? [(departureCoords.lat + arrivalCoords.lat) / 2, (departureCoords.lng + arrivalCoords.lng) / 2]
        : [40.7128, -74.006] // Default to New York

    return (
        <div style={{ height: "400px", width: "100%" }}>
            <MapContainer center={centerPosition} zoom={4} style={{ height: "100%", width: "100%" }}>
                <MapUpdater center={centerPosition} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Departure Marker */}
                {isValidCoords(departureCoords) && (
                    <Marker position={[departureCoords.lat, departureCoords.lng]} icon={customIcon} />
                )}

                {/* Arrival Marker */}
                {isValidCoords(arrivalCoords) && (
                    <Marker position={[arrivalCoords.lat, arrivalCoords.lng]} icon={customIcon} />
                )}

                {/* Flight Route (Polyline) */}
                {isValidCoords(departureCoords) && isValidCoords(arrivalCoords) ? (
                    <Polyline
                        positions={[
                            [departureCoords.lat, departureCoords.lng],
                            [arrivalCoords.lat, arrivalCoords.lng]
                        ]}
                        color="blue"
                        weight={4}
                        opacity={0.8}
                    />
                ) : (
                    <Typography color="error">Flight route unavailable.</Typography>
                )}
            </MapContainer>
        </div>
    )
}

export default FlightMap

