import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Date of birth is required"],
            validate: {
                validator: function (value) {
                    return value < new Date();
                },
                message: "Date of birth must be in the past",
            },
        },
        weight: {
            type: Number,
            required: [true, "Weight is required"],
            min: [1, "Weight must be greater than 0"],
            max: [1000, "Weight must be less than 1000 kg"],
        },
        height: {
            type: Number,
            required: [true, "Height is required"],
            min: [1, "Height must be greater than 0"],
            max: [300, "Height must be less than 300 cm"],
        },
        dietaryPreference: {
            type: String,
            required: [true, "Dietary preference is required"],
            enum: {
                values: [
                    "Dietary preference",
                    "Gluten Free",
                    "Vegetarian",
                    "Vegan",
                    "Dairy Free",
                    "Paleo",
                    "Keto",
                    "Low Carb",
                    "High Protein",
                    "None",
                ],
                message: "Please select a valid dietary preference",
            },
        },
        favouriteMeal: {
            type: String,
            required: [true, "Favourite meal is required"],
            trim: true,
            maxlength: [100, "Favourite meal cannot exceed 100 characters"],
        },
        orders: [
            {
                type: mongoose.Schema.Types.Mixed,
                default: [],
            },
        ],
    },
    {
        timestamps: true, // This adds createdAt and updatedAt fields automatically
    }
);

// Add virtual for full name
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Add virtual for age calculation
userSchema.virtual("age").get(function () {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", {
    virtuals: true,
});

const User = mongoose.model("User", userSchema);

export default User;
