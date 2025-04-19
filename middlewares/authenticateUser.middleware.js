import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

     // Verify token
     const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request object
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };

    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
}


export default isAuthenticated;