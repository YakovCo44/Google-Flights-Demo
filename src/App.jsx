import React from "react"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ResultsPage from "./pages/ResultsPage"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </Router>
    )
}

export default App


