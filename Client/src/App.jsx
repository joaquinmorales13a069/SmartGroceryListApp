import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    // Check authentication on component mount
    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            // User is not authenticated, redirect to login
            navigate("/login");
        } else {
            // User is authenticated, redirect to dashboard
            navigate("/dashboard");
        }
    }, [navigate]);

    return null; // This component doesn't render anything, it just handles redirects
}

export default App;
