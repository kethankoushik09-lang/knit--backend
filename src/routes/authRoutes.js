const express = require("express");
const {
  registerUser,
  loginUser,
  AdminloginUser,
  logoutAdmin,
  logoutUser
} = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/user/sigup", registerUser);
authRouter.post("/user/login", loginUser);
authRouter.post("/admin/login", AdminloginUser);
authRouter.post("/user/logout", logoutUser);
authRouter.post("/admin/logout", logoutAdmin);

module.exports = authRouter;
