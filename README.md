# Smart Grocery List App with AI Meal Planner

## Project Description

This web application is designed to assist users in managing their grocery shopping more efficiently by leveraging AI-driven meal planning. The app will enable users to securely log in, maintain an inventory of pantry items, and receive personalized recipe suggestions based on available ingredients. Users can also specify dietary preferences and favourite meals, allowing the AI to tailor recommendations accordingly. This project will combine frontend and backend development with cloud integration and AI services to deliver a practical, real-world solution.

## Features

-   **User Authentication**: Secure login and registration system
-   **Grocery List Management**: Create, view, and manage grocery lists
-   **Item Catalog**: Browse and search through available grocery items
-   **AI Meal Planning**: Personalized recipe suggestions (coming soon)
-   **Dashboard Analytics**: Track spending, category breakdown, and shopping patterns
-   **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## Tech Stack

### Frontend

-   **React 19** - Modern React with hooks and functional components
-   **Vite** - Fast build tool and development server
-   **Tailwind CSS** - Utility-first CSS framework for styling
-   **React Router DOM** - Client-side routing
-   **Axios** - HTTP client for API requests
-   **React Toastify** - Toast notifications
-   **React Icons** - Icon library

### Backend

-   **Node.js** - JavaScript runtime
-   **Express.js** - Web application framework
-   **MongoDB** - NoSQL database
-   **Mongoose** - MongoDB object modeling
-   **JWT** - JSON Web Tokens for authentication
-   **bcrypt** - Password hashing
-   **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this project, make sure you have the following installed:

-   **Node.js** (v18 or higher)
-   **npm** (v9 or higher)
-   **MongoDB** (v6 or higher) - Make sure MongoDB is running locally or have a MongoDB Atlas connection string

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/joaquinmorales13a069/SmartGroceryListApp.git>
cd ITA602-Project
```

### 2. Install Dependencies

Install dependencies for both client and server:

```bash
# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `Server` directory:

```bash
cd Server
touch .env
```

Add the following environment variables to the `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-grocery-app
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Note**: Replace `your_jwt_secret_key_here` with a secure random string for JWT token signing.

### 4. Database Setup

#### Option A: Local MongoDB

If you're using a local MongoDB instance:

1. Make sure MongoDB is running on your system
2. The application will automatically create the database when it first connects

#### Option B: MongoDB Atlas

If you're using MongoDB Atlas:

1. Create a cluster on MongoDB Atlas
2. Get your connection string
3. Replace the `MONGODB_URI` in your `.env` file with your Atlas connection string

### 5. Seed the Database (Optional)

To populate the database with sample data:

```bash
cd Server
npm run seed
```

This will create sample items and user data for testing.

## Running the Application

### Development Mode

1. **Start the Server** (Terminal 1):

```bash
cd Server
npm run dev
```

The server will start on `http://localhost:5000`

2. **Start the Client** (Terminal 2):

```bash
cd Client
npm run dev
```

The client will start on `http://localhost:5173`

### Production Mode

1. **Build the Client**:

```bash
cd Client
npm run build
```

2. **Start the Server**:

```bash
cd Server
npm start
```

## Project Structure

```
ITA602-Project/
├── Client/                          # Frontend React application
│   ├── public/                      # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/                  # Images and static files
│   │   │   └── react.svg
│   │   ├── components/              # React components
│   │   │   ├── dashboard/           # Dashboard-specific components
│   │   │   │   ├── CreateGroceryList.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── GroceryList.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── UserGroceryLists.jsx
│   │   │   ├── CartItemCard.jsx
│   │   │   ├── GroceryListItemCard.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── MealPlanCard.jsx
│   │   │   └── QuantityControl.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── userDashboard.jsx
│   │   ├── App.jsx                  # Main App component
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # Application entry point
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── eslint.config.js             # ESLint configuration
├── Server/                          # Backend Node.js application
│   ├── controllers/                 # Route controllers
│   │   ├── groceryListController.js
│   │   ├── itemControllers.js
│   │   └── userControllers.js
│   ├── middleware/                  # Express middleware
│   │   ├── authMiddleware.js        # JWT authentication
│   │   └── connectDB.js             # Database connection
│   ├── models/                      # Mongoose models
│   │   ├── groceryListModel.js
│   │   ├── itemModel.js
│   │   └── userModel.js
│   ├── routes/                      # API routes
│   │   ├── groceryListRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── routes.js                # Main routes file
│   │   └── userRoutes.js
│   ├── scripts/                     # Database scripts
│   │   ├── runMongoTemplate.js
│   │   └── seedDatabase.js
│   ├── package.json                 # Backend dependencies
│   └── server.js                    # Server entry point
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

## API Endpoints

### Authentication

-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `GET /api/auth/profile` - Get user profile

### Items

-   `GET /api/items` - Get all items (with pagination and search)
-   `POST /api/items` - Create new item
-   `GET /api/items/:id` - Get item by ID
-   `PUT /api/items/:id` - Update item
-   `DELETE /api/items/:id` - Delete item

### Grocery Lists

-   `GET /api/grocery-lists` - Get all user's grocery lists
-   `POST /api/grocery-lists` - Create new grocery list
-   `GET /api/grocery-lists/:id` - Get grocery list by ID
-   `PATCH /api/grocery-lists/:id` - Update grocery list
-   `DELETE /api/grocery-lists/:id` - Delete grocery list

## Available Scripts

### Server Scripts

-   `npm run dev` - Start development server with nodemon
-   `npm start` - Start production server
-   `npm run seed` - Seed database with sample data
-   `npm run seed-template` - Run MongoDB template script

### Client Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint

## Testing

For detailed testing instructions, refer to the testing documentation in the project repository. The testing covers:

1. **Create New Grocery List** - Complete flow from item selection to list creation
2. **View All Grocery Lists** - List management and navigation
3. **View Individual Grocery List Details** - Detailed view and item management
4. **Cross-Functionality Integration** - Dashboard integration and responsive design

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team Members

-   **Joaquin Morales** - Project Manager and Fullstack developer
-   **Gurpreet Kaur** - Frontend Development
-   **Harry Suter** - Backend Development
-   **Kennedy Kamau** - Fullstack developer

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
