const jwt = require("jsonwebtoken");

const generateToken = (payload, secret, expired) => {
  return jwt.sign(payload, secret, {
    expiresIn: expired,
  });
};

const verifyUserToken = async (token, secret) => {
  try {
    const result = jwt.verify(token, secret);
    return result;
  } catch (err) {
    return res.status(401).json({
      message: "Authentification error, please check your token.",
    });
  }
};

module.exports = { generateToken, verifyUserToken };
