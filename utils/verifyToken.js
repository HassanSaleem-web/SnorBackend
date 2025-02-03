const admin = require("../firebase");

const verifyToken = async (idToken) => {

    
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase token:", error.message);
    throw new Error("Invalid or expired token.");
  }
};

module.exports = verifyToken;
