const express = require("express");
const {
  Registration,
  Login,
  ForgotPassword,
  VerifyCode,
  ChangePassword,
  LogoutUser,
} = require("../controller/auth");

const router = express.Router();

router.get("/r", (req, res) => {
  console.log("testing route");

  return res.status(200).json({
    message: "testing route",
  });
});

router.post("/", Registration);
router.post("/login", Login);
router.post("/forgot", ForgotPassword);
router.post("/verify", VerifyCode);
router.post("/reset", ChangePassword);
router.get("/logout", LogoutUser);

module.exports = router;
