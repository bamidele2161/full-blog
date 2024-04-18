const generateRandomString = (length) => {
  let code = "";
  let schema = "0123456789";

  for (let i = 0; i < length; i++) {
    code += schema.charAt(Math.floor(Math.random() * schema.length));
  }
  return code;
};

const encodeString = async (salt, password) => {
  let saltedPassword = salt + password;
  const hashedPassword = Buffer.from(saltedPassword).toString("base64");
  return hashedPassword;
};

const decodeString = async (hashedPassword) => {
  const decode = Buffer.from(hashedPassword, "base64").toString();
  return decode.slice(32);
};

module.exports = {
  encodeString,
  decodeString,
  generateRandomString,
};
