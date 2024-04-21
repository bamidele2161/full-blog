const bcrypt = require("bcryptjs");

const hasher = (value, salt) => bcrypt.hash(value, salt);

const matchChecker = (value, dbValue) => {
  let compare = bcrypt.compare(value, dbValue);
  return compare;
};

const generateRandomString = (length) => {
  let code = "";
  let schema = "0123456789";

  for (let i = 0; i < length; i++) {
    code += schema.charAt(Math.floor(Math.random() * schema.length));
  }

  return code;
};
module.exports = { hasher, matchChecker, generateRandomString };
