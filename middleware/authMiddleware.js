const admin = require("../config/firebase-admin-config");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);

    if (decodeValue) {
      console.log(decodeValue);
      return next();
    }
    return res.json({ message: "un authorized user found" });
  } catch (error) {
    return res.json({ message: `Internal error ${error}` });
  }
}

module.exports = authMiddleware;
