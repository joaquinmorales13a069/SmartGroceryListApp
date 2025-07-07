import jwt from "jsonwebtoken";

// Middleware to check if user is authenticated
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header
  console.log(token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token is not valid or has expired",
      });
    }

    // Attach user info to request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};
