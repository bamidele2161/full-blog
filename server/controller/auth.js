const DbConnection = require("../config/dbConnection");
const {
  checkUserExistenceQuery,
  createUserQuery,
  updateUserQuery,
  checkCodeExistenceQuery,
  updateUserCodeQuery,
} = require("../queries/auth");
const {
  hashPassword,
  encodeString,
  decodeString,
  generateRandomString,
  hasher,
  matchChecker,
} = require("../utils/hashPassword");
const { sendEmail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/token");

exports.Registration = async (req, res) => {
  const client = await DbConnection();
  try {
    const { first_name, last_name, email, password, phone, image } = req.body;
    const checkUserExistence = await client.query(checkUserExistenceQuery, [
      email,
    ]);
    if (checkUserExistence.rowCount === 1) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const cryptedPassword = await hasher(password, 12);

    const values = [
      first_name,
      last_name,
      email,
      cryptedPassword,
      phone,
      image,
    ];
    const createUser = await client.query(createUserQuery, values);

    if (!createUser) {
      return res.status(400).json({
        message: "Error occured while creating user",
      });
    }
    const userSecret = process.env.TOKEN_USER_SECRET;
    const token = generateToken(
      { id: createUser.rows[0].id },
      userSecret,
      "14d"
    );

    return res.status(200).json({
      message: "Account created successfully",
      data: {
        id: createUser.rows[0].id,
        first_name: createUser.rows[0].first_name,
        last_name: createUser.rows[0].last_name,
        email: createUser.rows[0].email,
      },
      token: token,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

exports.Login = async (req, res) => {
  const client = await DbConnection();
  try {
    const { email, password } = req.body;

    const checkUserExistence = await client.query(checkUserExistenceQuery, [
      email,
    ]);
    if (checkUserExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "User does not exist!",
      });
    }

    console.log(password);
    let checkPassword = await matchChecker(
      password,
      checkUserExistence.rows[0].password
    );

    if (!checkPassword) {
      return res.status(404).json({
        error: "Invalid credentials!",
      });
    }

    const userSecret = process.env.TOKEN_USER_SECRET;
    const token = generateToken(
      { id: checkUserExistence.rows[0].id },
      userSecret,
      "14d"
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false, // Set to true if served over HTTPS
      maxAge: 3600000, // 1 hour
    });
    return res.status(200).json({
      message: "User login successfully",
      data: {
        id: checkUserExistence.rows[0].id,
        first_name: checkUserExistence.rows[0].first_name,
        last_name: checkUserExistence.rows[0].last_name,
        email: checkUserExistence.rows[0].email,
      },
      token: token,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

// forgot password service
exports.ForgotPassword = async (req, res) => {
  try {
    const client = await DbConnection();
    const { email } = req.body;

    const checkUserExistence = await client.query(checkUserExistenceQuery, [
      email,
    ]);
    if (checkUserExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "User does not exist!",
      });
    }
    console.log(checkUserExistence.rows);
    const resetCode = generateRandomString(6);

    const updateUser = await client.query(updateUserQuery, [
      resetCode,
      checkUserExistence.rows[0].id,
    ]);

    if (!updateUser) {
      return res.status(400).json({
        message: "Error occured while updating user",
      });
    }

    //send user email
    const subject = "Reset Password.";
    const payload = {
      name: checkUserExistence.rows[0].first_name,
      otp: resetCode,
    };

    sendEmail(payload, email, subject, "../view/otp.ejs");

    const response = {
      message: "Email reset code has been sent to your email",
      statusCode: 200,
    };

    return res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

// change password service
exports.VerifyCode = async (req, res) => {
  const client = await DbConnection();
  try {
    const { ressetcode, email } = req.body;

    const checkUserExistence = await client.query(checkUserExistenceQuery, [
      email,
    ]);

    console.log(checkUserExistence.rowCount);
    if (checkUserExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "User does not exist!",
      });
    }

    const checkCodeExistence = await client.query(checkCodeExistenceQuery, [
      ressetcode,
      email,
    ]);
    console.log(checkCodeExistence.rowCount);
    if (checkCodeExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "Invalid reset code!",
      });
    }

    const response = {
      message: "Password reset code verified successfully",
      statusCode: 200,
    };
    return res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

// change password service
exports.ChangePassword = async (req, res) => {
  const client = await DbConnection();
  try {
    const { password, email } = req.body;

    const checkUserExistence = await client.query(checkUserExistenceQuery, [
      email,
    ]);
    if (checkUserExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "User does not exist!",
      });
    }

    const updateUser = await client.query(updateUserCodeQuery, [
      password,
      checkUserExistence.rows[0].id,
    ]);

    if (updateUser.rowCount !== 1) {
      return res.status(400).json({
        message: "Error occurred while updating user",
      });
    }

    const response = {
      message: "Password reset successfully",
      statusCode: 200,
    };

    return res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};
