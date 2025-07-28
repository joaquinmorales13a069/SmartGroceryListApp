import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboard from "./pages/userDashboard";

function App() {
    const navigate = useNavigate();

    // Check authentication on component mount
    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            // User is not authenticated, redirect to login
            navigate("/login");
        }
    }, [navigate]);

    return <>
        <UserDashboard />
    </>
}

export default App;
