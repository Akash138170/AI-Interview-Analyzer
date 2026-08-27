const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/*
|--------------------------------------------------------------------------
| Cookie Configuration
|--------------------------------------------------------------------------
|
| HTTP-only cookies prevent client-side JavaScript from directly accessing
| the authentication token.
|
| For cross-site frontend/backend deployments, set:
|
| COOKIE_SAME_SITE=none
|
| Otherwise "lax" is recommended.
|
*/

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite:
    process.env.COOKIE_SAME_SITE || "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

async function registerUserController(req, res) {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message:
          "Please provide username, email and password",
      });
    }

    const isUserAlreadyExists =
      await userModel.findOne({
        $or: [{ username }, { email }],
      });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message:
          "Account already exist with this email and username",
      });
    }

    const hash = await bcrypt.hash(
      password,
      10
    );

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie(
      "token",
      token,
      cookieOptions
    );

    return res.status(201).json({
      message:
        "User registered succesfully",

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Register user error:",
      error?.message || error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

async function loginUserController(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message:
          " Invalid email or password",
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie(
      "token",
      token,
      cookieOptions
    );

    return res.status(200).json({
      message:
        "User loggedIn succesfully",

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login user error:",
      error?.message || error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
|--------------------------------------------------------------------------
| Logout User
|--------------------------------------------------------------------------
*/

async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
      await tokenBlacklistModel.create({
        token,
      });
    }

    res.clearCookie(
      "token",
      cookieOptions
    );

    return res.status(200).json({
      message:
        "User logged out successfully",
    });
  } catch (error) {
    console.error(
      "Logout user error:",
      error?.message || error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

async function getMeController(req, res) {
  try {
    const user =
      await userModel.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message:
        "user detials fetched succesfully",

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error?.message || error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};