import Item from "../models/itemModel.js";

// GET items - List/search items with pagination
export const getItems = async (req, res) => {
    try {
        // Extract query parameters for pagination and search
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        // search query
        const query = {};
        if (search) {
            // case-insensitive search
            query.name = { $regex: search, $options: "i" };
        }
        // execute the query with pagination
        const items = await Item.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination info
        const totalItems = await Item.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        // pages logic
        const hasNext = page < totalPages;  // Are there more pages?
    const hasPrev = page > 1;        

        res.status(200).json({
            success: true,
            data: items,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage: hasNext,
                hasPreviousPage: hasPrev,
                nextPage: hasNext ? page + 1 : null,
                previousPage: hasPrev ? page - 1 : null,
            },
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching items",
        });
    }
};

// POST item - Create a new item
export const createItem = async (req, res) => {
    const { name, price, batchNumber, expiryDate, nutrition } = req.body;

    if (!name || !price || !expiryDate) {
        return res.status(400).json({
            success: false,
            message: "One or more required fields are missing",
        });
    }
    // Validate price is not negative or zero
    if (price <= 0) {
        return res.status(400).json({
            success: false,
            message: "Price must be greater than zero",
        });
    }
    // Validate expiry date is today or in the future
    const today = new Date().setHours(0, 0, 0, 0);
    if (new Date(expiryDate) < today) {
        return res.status(400).json({
            success: false,
            message: "Expiry date must be today or in the future",
        });
    }

    try {
        // Create new item 
        const itemData = new Item({
            name: name,
            price,
            batchNumber: batchNumber ? batchNumber.trim() : undefined,
            expiryDate: new Date(expiryDate),
            nutrition: nutrition || {},
            createdBy: req.user.id, // Use authenticated user's ID
        });

        const newItem = await itemData.save();
        res.status(201).json({
            success: true,
            message: "Item created successfully",
            data: {
                _id: newItem._id,
                name: newItem.name,
                price: newItem.price,
                batchNumber: newItem.batchNumber,
                expiryDate: newItem.expiryDate,
                nutrition: newItem.nutrition,
                createdAt: newItem.createdAt,
                updatedAt: newItem.updatedAt
            }
        })
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating item"
        });
    }
};

