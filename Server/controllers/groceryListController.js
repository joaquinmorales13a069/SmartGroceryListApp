import GroceryList from "../models/groceryListModel.js";
import axios from "axios";

// ✅ Generate AI meal plans using n8n workflow
const generateMealPlansForList = async (listId, userId) => {
    try {
        console.log(`🤖 Starting AI meal generation for list: ${listId}`);

        // Fetch the grocery list with populated items
        const list = await GroceryList.findById(listId).populate(
            "items.item",
            "name price nutrition"
        );

        if (!list) {
            throw new Error("Grocery list not found");
        }

        // Transform data for AI processing
        const ingredients = list.items.map((item) => ({
            name: item.item.name,
            quantity: item.quantity,
            nutrition: item.item.nutrition || {},
        }));
        console.log(
            `📋 Processing ${ingredients.length} ingredients:`,
            ingredients.map((i) => `${i.name} (${i.quantity})`)
        );

        // Prepare clean payload for n8n
        const requestPayload = {
            groceryList: listId,
            ingredients: ingredients,
            userId: userId,
            requestedAt: new Date().toISOString(),
        };

        // Call n8n webhook with header authentication
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
                // n8n webhook authentication
                "N8N_WEBHOOK_API_KEY": process.env.N8N_WEBHOOK_API_KEY,
            },
        });

        console.log(`✅ n8n response received:`, {
            status: response.status,
            mealCount: response.data?.mealPlans?.length || 0,
        });

        // Validate and save response from n8n workflow
        if (response.data && response.data.success && response.data.mealPlans) {
            list.mealPlans = response.data.mealPlans;
            await list.save();

            console.log(
                `💾 Saved ${response.data.mealPlans.length} meal plans to database`
            );
            return response.data.mealPlans;
        } else {
            throw new Error("Invalid response format from n8n workflow");
        }
    } catch (error) {
        console.error("❌ Error in generateMealPlansForList:", error.message);

        // Enhanced error handling for different scenarios
        if (error.response?.status === 401) {
            console.error(
                "🔐 Authentication failed - check N8N_WEBHOOK_API_KEY"
            );
        } else if (error.response?.status === 403) {
            console.error("🚫 Forbidden - webhook authentication rejected");
        } else if (error.code === "ECONNREFUSED") {
            console.error(
                "🔌 Connection refused - check if n8n is running and accessible"
            );
        } else if (error.code === "ENOTFOUND") {
            console.error("🌐 DNS resolution failed - check the n8n URL");
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
        // ✅ Use correct field name from schema: user
        const groceryList = new GroceryList({
            name,
            items,
            mealPlans: mealPlans || [], // Default to empty array (generated later by generateMealPlansForList())
            user: req.user.userId, 
        });

        const newGroceryList = await groceryList.save();

        // Trigger AI meal generation asynchronously

        setImmediate(async ()=> {
            try {
                await generateMealPlansForList(newGroceryList._id, req.user.userId);
                console.log(`🎉 Background meal generation completed for list: ${newGroceryList._id}`);
            } catch (error) {
                console.error(`💥 Background meal generation failed for list: ${newGroceryList._id}`, error.message);
            }
        })

        res.status(201).json({
            success: true,
            message: "Grocery list created successfully. AI meal suggestions are being generated in the background.",
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

        const list = await GroceryList.findOne({
            _id: id,
            user: req.user.userId,
        }).populate("items.item", "name price nutrition")

        // List validation
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

        // Generate meal plans
        const mealPlans = await generateMealPlansForList(id, req.user.userId);

        res.status(201).json({
            success: true,
            message: "Meal plans generated successfully",
            data: mealPlans
        })

    } catch (error) {
        console.error("Error in manual meal generation:", error);
        
        let errorMessage = "Server error while generating meal plans";
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            errorMessage = "AI service authentication failed. Please contact support.";
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            errorMessage = "AI service is temporarily unavailable. Please try again later.";
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
}

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

