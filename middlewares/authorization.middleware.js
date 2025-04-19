import { connection } from "../config/db.js";

// Middleware to check for allowed roles (e.g., ['admin', 'superadmin'])

export const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
      try {
        // First Check is User Logged In
        const userId = req.user?.id;
        if (!userId) {
          return res.status(401).json({success: false, message: "Unauthorized: No User Id Found" });
        }


        // GET user type from the database
        const [rows] = await connection.execute(
          `SELECT user_type FROM Users WHERE id = ?`,
          [userId]
        );

        const user = rows[0];
        if (!user) {
          return res.status(404).json({success:false, message: "User not found." });
        }

          // Check if user_type is in allowedRoles
          if (!allowedRoles.includes(user.user_type)) {
            return res.status(403).json({
               success: false,
               message: `Forbidden: Only [${allowedRoles.join(", ")}] can access this resource.`,
             });
          }

          next(); // User is authorized

      } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Internal Server Error" });  
      }
    };
}