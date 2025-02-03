const verifyToken = require("../utils/verifyToken");

const authenticateUser = async (req, res, next) => {
  let idToken = req.headers.authorization?.split("Bearer ")[1];
  
  if (idToken?.startsWith('"') && idToken?.endsWith('"')) {
    idToken = idToken.slice(1, -1); // Remove the first and last characters (quotes)
  }

  if (!idToken) {
    return res.status(401).json({ message: "Unauthorized access. Token missing." });
  }

  try {
    const decodedToken = await verifyToken(idToken); // Use shared verifyToken function
    req.user = decodedToken; // Attach decoded token to request
    

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error.message);
    res.status(403).json({ message: "Forbidden access. Invalid token." });
  }
};

module.exports = authenticateUser;
