import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../ItemCard";
import CartItemCard from "../CartItemCard";

const CreateGroceryList = () => {
    const [availableItems, setAvailableItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch items from the backend
    const fetchItems = async (page = 1, search = "") => {
        try {
            setLoading(true);
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Authentication required");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/items`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: {
                        page,
                        search,
                    },
                }
            );

            if (response.data.success) {
                setAvailableItems(response.data.data);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setCurrentPage(response.data.pagination?.currentPage || 1);
                setTotalItems(response.data.pagination?.totalItems || 0);
                setError(null); // Clear any previous errors
                console.log("Pagination data:", response.data.pagination);
            } else {
                setError("Failed to fetch items");
            }
        } catch (err) {
            console.error("Error fetching items:", err);
            setError(err.response?.data?.message || "Failed to fetch items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page when searching
        setLoading(true); // Show loading state during search
        fetchItems(1, searchTerm.trim()); // Trim whitespace from search term
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
        setLoading(true);
        fetchItems(1, "");
    };

    // Handle pagination
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) {
            return; // Prevent invalid page navigation
        }
        setCurrentPage(page);
        setLoading(true); // Show loading state during pagination
        fetchItems(page, searchTerm);
    };

    // Add item to cart
    const addToCart = (item) => {
        const existingItem = cartItems.find(
            (cartItem) => cartItem._id === item._id
        );

        if (existingItem) {
            setCartItems(
                cartItems.map((cartItem) =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            );
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    // Update item quantity in cart
    const updateCartItemQuantity = (itemId, newQuantity) => {
        setCartItems(
            cartItems.map((item) =>
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter((item) => item._id !== itemId));
    };

    // Calculate total
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    // Handle form submission (prepare data structure for now)
    const handleCreateList = () => {
        if (cartItems.length === 0) {
            alert("Please add items to your grocery list");
            return;
        }

        const groceryListData = {
            name: `Grocery List - ${new Date().toLocaleDateString()}`,
            items: cartItems.map((item) => ({
                item: item._id,
                quantity: item.quantity,
                expiryDate: item.expiryDate,
            })),
            status: "active",
        };

        console.log("Grocery List Data:", groceryListData);
        alert("Grocery list data prepared! Check console for details.");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[#76C893] text-lg">Loading items...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-[#FF6F61] text-lg">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F9F5EF] relative -m-4">
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-[#333333]">
                    Create New Grocery List
                </h1>

                {/* Search Bar */}
                <div className="mb-6">
                    <form
                        onSubmit={handleSearch}
                        className="flex gap-2 max-w-md mx-auto"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search items..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#76C893] focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#76C893] text-white rounded-lg hover:bg-[#FFB74D] transition-colors duration-200"
                        >
                            Search
                        </button>
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70%]">
                    {/* Available Items */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg overflow-auto">
                        <h2 className="text-xl font-semibold mb-4 text-[#333333]">
                            Available Items
                        </h2>

                        {availableItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No items found.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableItems.map((item) => (
                                    <ItemCard
                                        key={item._id}
                                        item={item}
                                        onAddToCart={addToCart}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {availableItems.length > 0 && (
                            <div className="flex flex-col items-center gap-2 mt-6">
                                {totalPages > 1 ? (
                                    <div className="flex justify-center items-center gap-3">
                                        {/* Previous Page Arrow */}
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="p-3 bg-gray-200 text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                                            title="Previous page"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>

                                        {/* Page Info */}
                                        <div className="flex items-center gap-2">
                                            <span className="px-4 py-2 bg-[#76C893] text-white rounded-lg font-medium">
                                                Page {currentPage} of{" "}
                                                {totalPages}
                                            </span>
                                        </div>

                                        {/* Page Numbers (show up to 5 pages) */}
                                        {totalPages <= 5 && (
                                            <div className="flex items-center gap-1">
                                                {Array.from(
                                                    { length: totalPages },
                                                    (_, i) => i + 1
                                                ).map((pageNum) => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() =>
                                                            handlePageChange(
                                                                pageNum
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                                            pageNum ===
                                                            currentPage
                                                                ? "bg-[#76C893] text-white"
                                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Next Page Arrow */}
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="p-3 bg-gray-200 text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                                            title="Next page"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        All items displayed
                                    </div>
                                )}
                                <p className="text-sm text-gray-600">
                                    Showing {availableItems.length} of{" "}
                                    {totalItems || "?"} items
                                    {totalPages > 1 &&
                                        ` (Page ${currentPage} of ${totalPages})`}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Shopping Cart */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-[#333333]">
                                My Grocery List
                            </h2>
                            <div className="text-lg font-semibold text-[#76C893]">
                                Total: ${calculateTotal().toFixed(2)}
                            </div>
                        </div>

                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No items in your list.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <CartItemCard
                                        key={item._id}
                                        item={item}
                                        onUpdateQuantity={
                                            updateCartItemQuantity
                                        }
                                        onRemoveItem={removeFromCart}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Create List Button */}
                        {cartItems.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <button
                                    onClick={handleCreateList}
                                    className="w-full py-3 bg-[#76C893] text-white rounded-lg font-semibold hover:bg-[#FFB74D] transition-colors duration-200"
                                >
                                    Create Grocery List
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroceryList;
