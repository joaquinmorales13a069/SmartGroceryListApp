import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import UserDashboard from "./pages/userDashboard.jsx";
import CreateGroceryList from "./components/dashboard/CreateGroceryList.jsx";
import UserGroceryLists from "./components/dashboard/UserGroceryLists.jsx";
import GroceryList from "./components/dashboard/GroceryList.jsx";
import UserSettings from "./components/dashboard/UserSettings.jsx";
import ListAllItems from "./components/dashboard/ListAllItems.jsx";
import ListAllUsers from "./components/dashboard/ListAllUsers.jsx";
import setupAxios from "./utils/setupAxios.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route
                    path="/create-new-list"
                    element={<CreateGroceryList />}
                />
                <Route
                    path="/all-grocery-lists"
                    element={<UserGroceryLists />}
                />
                <Route
                    path="/all-grocery-lists/:listId"
                    element={<GroceryList />}
                />
                <Route path="/settings" element={<UserSettings />} />
                {/* Admin Routes */}
                <Route path="/admin/items" element={<ListAllItems />} />
                <Route path="/admin/users" element={<ListAllUsers />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </BrowserRouter>
    </StrictMode>
);
