import GroceryList from "../models/groceryListModel.js";
import axios from "axios";

const generateMealPlansForList = async (listId, userId) => {
    try {
        console.log(`🤖 Starting AI meal generation for list: ${listId}`);

        const list = await GroceryList.findById(listId).populate(
            "items.item",
            "name price nutrition"
        );

        if (!list) {
            throw new Error("Grocery list not found");
        }

        const ingredients = list.items.map((item) => ({
            name: item.item.name,
            quantity: item.quantity,
            nutrition: item.item.nutrition || {},
        }));

        console.log(
            `📋 Processing ${ingredients.length} ingredients:`,
            ingredients.map((i) => `${i.name} (${i.quantity})`)
        );

        const requestPayload = {
            groceryListId: listId,
            ingredients: ingredients,
            userId: userId,
            requestedAt: new Date().toISOString(),
        };

        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

        if (!n8nWebhookUrl) {
            throw new Error(
                "N8N_WEBHOOK_URL not configured in environment variables"
            );
        }

        console.log(`🌐 Calling n8n webhook: ${n8nWebhookUrl}`);

        const response = await axios.post(n8nWebhookUrl, requestPayload, {
            timeout: parseInt(process.env.N8N_REQUEST_TIMEOUT) || 60000,
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "GroceryApp-Server/1.0",
                "N8N_WEBHOOK_API_KEY": process.env.N8N_WEBHOOK_API_KEY,
            },
        });

        console.log(`✅ n8n response received:`, {
            status: response.status,
            dataType: Array.isArray(response.data) ? "array" : "object",
            arrayLength: Array.isArray(response.data)
                ? response.data.length
                : "N/A",
        });

        // Handle the array response from n8n - FIXED VERSION
        let mealPlans;

        if (Array.isArray(response.data)) {
            // n8n returned an array, get the first element
            const firstElement = response.data[0];
            if (
                firstElement &&
                firstElement.success &&
                firstElement.mealPlans
            ) {
                mealPlans = firstElement.mealPlans;
                console.log(
                    `📦 Successfully extracted ${mealPlans.length} meal plans from array response`
                );
            } else {
                console.error(
                    "❌ Invalid structure in array response:",
                    firstElement
                );
                throw new Error("Invalid array response structure from n8n");
            }
        } else if (
            response.data &&
            response.data.success &&
            response.data.mealPlans
        ) {
            // Direct object response
            mealPlans = response.data.mealPlans;
            console.log(
                `📦 Successfully extracted ${mealPlans.length} meal plans from object response`
            );
        } else {
            console.error("❌ Invalid response structure:", response.data);
            throw new Error("Invalid response format from n8n workflow");
        }

        // Final validation
        if (!Array.isArray(mealPlans) || mealPlans.length === 0) {
            console.error("❌ No valid meal plans found:", mealPlans);
            throw new Error("No meal plans received from n8n workflow");
        }

        // Save to database
        list.mealPlans = mealPlans;
        await list.save();

        console.log(
            `💾 Successfully saved ${mealPlans.length} meal plans to database`
        );
        console.log(
            `🎯 Meal plan names:`,
            mealPlans.map((meal) => meal.name)
        );

        return mealPlans;
    } catch (error) {
        console.error("❌ Error in generateMealPlansForList:", error.message);

        // Log response data for debugging
        if (error.response) {
            console.error("🔍 HTTP Error Response:", {
                status: error.response.status,
                data: JSON.stringify(error.response.data, null, 2),
            });
        }

        throw error;
    }
};

// ✅ Create Grocery List
export const createGroceryList = async (req, res) => {
    const { name, items, mealPlans } = req.body;

    // Validate fields
    if (!name || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message:
                "Name and items are required, and items must be a non-empty array",
        });
    }

    // Validate items
    for (const entry of items) {
        if (!entry.item || !entry.quantity) {
            return res.status(400).json({
                success: false,
                message: "Each item must have an item and quantity",
            });
        }
        if (entry.quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0",
            });
        }
        if (
            entry.expiryDate &&
            new Date(entry.expiryDate) < new Date().setHours(0, 0, 0, 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Expiry date must be today or in the future",
            });
        }
    }

    try {
        const groceryList = new GroceryList({
            name,
            items,
            mealPlans: mealPlans || [],
            user: req.user.userId,
        });

        const newGroceryList = await groceryList.save();
        console.log(`📝 Created new grocery list: ${newGroceryList._id}`);

        // Trigger AI meal generation asynchronously
        setImmediate(async () => {
            try {
                await generateMealPlansForList(
                    newGroceryList._id,
                    req.user.userId
                );
                console.log(
                    `🎉 Background meal generation completed for list: ${newGroceryList._id}`
                );
            } catch (error) {
                console.error(
                    `💥 Background meal generation failed for list: ${newGroceryList._id}`,
                    error.message
                );
            }
        });

        res.status(201).json({
            success: true,
            message:
                "Grocery list created successfully. AI meal suggestions are being generated in the background.",
            data: newGroceryList,
        });
    } catch (error) {
        console.error("Error creating grocery list:", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating grocery list",
        });
    }
};

// ✅ Manual Meal Generation Endpoint
export const generateMealPlans = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🔄 Manual meal generation requested for list: ${id}`);

        const list = await GroceryList.findOne({
            _id: id,
            user: req.user.userId,
        }).populate("items.item", "name price nutrition");

        if (!list) {
            return res.status(404).json({
                success: false,
                message: "Grocery list not found",
            });
        }

        if (list.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot generate meal plans for empty grocery list",
            });
        }

        const mealPlans = await generateMealPlansForList(id, req.user.userId);

        res.status(200).json({
            success: true,
            message: "Meal plans generated successfully",
            data: mealPlans,
        });
    } catch (error) {
        console.error("Error in manual meal generation:", error);

        let errorMessage = "Server error while generating meal plans";

        if (error.response?.status === 404) {
            errorMessage = "AI service endpoint not found.";
        } else if (
            error.code === "ECONNREFUSED" ||
            error.code === "ENOTFOUND"
        ) {
            errorMessage = "AI service is temporarily unavailable.";
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
};

// ✅ Delete Grocery List
export const deleteGroceryList = async (req, res) => {
    const { id } = req.params;

    try {
        const groceryList = await GroceryList.findOne({
            _id: id,
            user: req.user.userId, // FIXED
        });

        if (!groceryList) {
            return res.status(404).json({
                success: false,
                message: "Grocery list not found",
            });
        }

        await GroceryList.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Grocery list deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting grocery list:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting grocery list",
        });
    }
};

// ✅ Get All Lists
export const getAllGroceryLists = async (req, res) => {
    try {
        const lists = await GroceryList.find({ user: req.user.userId })
            .populate("items.item", "name price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: lists,
        });
    } catch (error) {
        console.error("Error fetching grocery lists:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching grocery lists",
        });
    }
};

// ✅ Get Single List
export const getGroceryListById = async (req, res) => {
    try {
        const { id } = req.params;
        const list = await GroceryList.findOne({
            _id: id,
            user: req.user.userId,
        }).populate("items.item", "name price");

        if (!list) {
            return res.status(404).json({
                success: false,
                message: "Grocery list not found",
            });
        }

        res.status(200).json({
            success: true,
            data: list,
        });
    } catch (error) {
        console.error("Error fetching grocery list by ID:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching grocery list",
        });
    }
};

// ✅ Update Grocery List
export const updateGroceryList = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status, mealPlans } = req.body;

        const list = await GroceryList.findOne({
            _id: id,
            user: req.user.userId, // FIXED
        });

        if (!list) {
            return res.status(404).json({
                success: false,
                message: "Grocery list not found",
            });
        }

        if (name) list.name = name.trim();
        if (status && ["active", "completed"].includes(status))
            list.status = status;
        if (mealPlans && Array.isArray(mealPlans)) list.mealPlans = mealPlans;

        await list.save();

        res.status(200).json({
            success: true,
            message: "Grocery list updated successfully",
            data: list,
        });
    } catch (error) {
        console.error("Error updating grocery list:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating grocery list",
        });
    }
};
