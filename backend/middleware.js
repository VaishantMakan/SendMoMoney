const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secrets");

const authMiddleware = (req, res, next) => {
  //fetch the authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  //get the token from auth header
  const token = authHeader.split(" ")[1]; //authHeader = 'Bearer <token>'

  try {
    //verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    //put the userId in the request object
    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(403).json({});
  }
};

module.exports = {
  authMiddleware,
};
