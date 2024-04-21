const { connectionPool } = require("../config/dbConnection");
const {
  checkUserExistenceQuery,
  createUserQuery,
  updateUserQuery,
  checkCodeExistenceQuery,
  updateUserCodeQuery,
} = require("../queries/auth");
const {
  generateRandomString,
  hasher,
  matchChecker,
} = require("../utils/hashPassword");
const { sendEmail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/token");
const {
  validateName,
  validateEmail,
  validateLength,
} = require("../utils/validation");

exports.Registration = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, image } = req.body;
    if (!validateName(first_name)) {
      return res.status(400).json({
        error: "Invalid first name provided.",
      });
    }
    if (!validateName(last_name)) {
      return res.status(400).json({
        error: "Invalid last name provided.",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: "Invalid email address provided.",
      });
    }
    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        error: "Your first name must be between 3 and 30 characters.",
      });
    }

    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        error: "Your last name must be between 3 and 30 characters.",
      });
    }

    if (!validateLength(password, 6, 30)) {
      return res.status(400).json({
        error: "Your password must be at least 6 characters.",
      });
    }
    const checkUserExistence = await connectionPool.query(
      checkUserExistenceQuery,
      [email]
    );
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
    const createUser = await connectionPool.query(createUserQuery, values);

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

    //send user email
    const subject = "Account Created Successfully.";
    const payload = {
      name: createUser.rows[0].first_name,
    };

    sendEmail(payload, email, subject, "../view/registration.ejs");

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
    error;
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUserExistence = await connectionPool.query(
      checkUserExistenceQuery,
      [email]
    );
    if (checkUserExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "User does not exist!",
      });
    }

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
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

// forgot password service
exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserExistence = await connectionPool.query(
      checkUserExistenceQuery,
      [email]
    );
    if (checkUserExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "User does not exist!",
      });
    }
    const resetCode = generateRandomString(6);

    const updateUser = await connectionPool.query(updateUserQuery, [
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
  try {
    const { ressetcode, email } = req.body;

    const checkUserExistence = await connectionPool.query(
      checkUserExistenceQuery,
      [email]
    );

    checkUserExistence.rowCount;
    if (checkUserExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "User does not exist!",
      });
    }

    const checkCodeExistence = await connectionPool.query(
      checkCodeExistenceQuery,
      [ressetcode, email]
    );
    checkCodeExistence.rowCount;
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
  try {
    const { password, email } = req.body;

    const checkUserExistence = await connectionPool.query(
      checkUserExistenceQuery,
      [email]
    );
    if (checkUserExistence.rowCount !== 1) {
      return res.status(404).json({
        error: "User does not exist!",
      });
    }
    const cryptedPassword = await hasher(password, 12);
    const updateUser = await connectionPool.query(updateUserCodeQuery, [
      cryptedPassword,
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

exports.LogoutUser = (req, res) => {
  //clear the cookie
  res.clearCookie("accessToken");

  // Send a response message along with the status code
  res.status(200).json({ message: "Logout successful", statusCode: 200 });
};
