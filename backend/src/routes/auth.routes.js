const { Router } = require("express");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

authRouter.post(
  "/register",
  authController.registerUserController
);

authRouter.post(
  "/login",
  authController.loginUserController
);

authRouter.get(
  "/logout",
  authController.logoutUserController
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

authRouter.get(
  "/get-me",
  authMiddleware.authUser,
  authController.getMeController
);

module.exports = authRouter;