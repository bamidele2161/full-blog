const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken; // Access the token from HTTP-only cookies

  if (!token) {
    return res.status(401).json({
      error: "Authorization token is missing.",
    }); // Unauthorized if no token
  }

  jwt.verify(token, process.env.TOKEN_USER_SECRET, (err, user) => {
    if (err) {
      err;
      return res.status(403).json({
        error: "Forbidden",
      }); // Forbidden if token is invalid
    }

    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
