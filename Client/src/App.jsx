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
        }
    }, [navigate]);

    return <div className="">App</div>;
}

export default App;
