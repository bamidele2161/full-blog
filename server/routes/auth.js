const express = require("express");
const {
  Registration,
  Login,
  ForgotPassword,
  VerifyCode,
  ChangePassword,
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

module.exports = router;
