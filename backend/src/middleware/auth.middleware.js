const jwt = require("jsonwebtoken");

const tokenBlacklistModel = require("../models/blacklist.model");

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
|
| Verifies the authentication token stored in the HTTP-only cookie
| and rejects tokens that have been blacklisted.
|
*/

async function authUser(req, res, next) {
  try {
    /*
    |--------------------------------------------------------------------------
    | 1. Get Token
    |--------------------------------------------------------------------------
    */

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Token not Provided",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Check Token Blacklist
    |--------------------------------------------------------------------------
    */

    const isTokenBlacklisted =
      await tokenBlacklistModel.findOne({
        token,
      });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "token is invalid",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Verify JWT
    |--------------------------------------------------------------------------
    */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
    |--------------------------------------------------------------------------
    | 4. Attach User Information
    |--------------------------------------------------------------------------
    */

    req.user = decoded;

    next();
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | Authentication / Database Error
    |--------------------------------------------------------------------------
    */

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    console.error(
      "Authentication middleware error:",
      error?.message || error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  authUser,
};