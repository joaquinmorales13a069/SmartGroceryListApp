import GroceryList from "../models/groceryListModel";

// POST Grocery List - add new grocery list
export const createGroceryList = async (req, res) => {
    const { name, items, mealPlans } = req.body;

    // Validate required fields
    if (!name || !Array.isArray(items) || !mealPlans) {
        return res.status(400).json({
            success: false,
            message: "One or more required fields are missing",
        });
    }

    // Validate items array
    if (items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Items array cannot be empty",
        });
    }

    // Validate each item on items array has at least 1 quantity, expiry date is today or in the future, and quantity is greater than 0
    for (const entry of items) {
        if (!entry.item || !entry.quantity) {
            return res.status(400).json({
                success: false,
                message: "Each item must have an item and quantity",
            });
        }
        if (entry.quantity >= 1) {
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

    // Validate mealPlans array
    if (!Array.isArray(mealPlans) || mealPlans.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Meal plans array cannot be empty",
        });
    }

    // Create new Grocery List and store it in the database

    try {
        const groceryList = new GroceryList({
            name,
            items,
            mealPlans,
            createdBy: req.user.id,
        });

        const newGroceryList = await groceryList.save();
        res.status(201).json({
            success: true,
            message: "Grocery list created successfully",
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
