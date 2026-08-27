const mongoose = require("mongoose");

/*
|--------------------------------------------------------------------------
| MongoDB Connection
|--------------------------------------------------------------------------
*/

async function connectToDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not configured."
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "Database connected successfully."
    );
  } catch (error) {
    console.error(
      "Database connection failed:",
      error?.message || error
    );

    /*
    |--------------------------------------------------------------------------
    | Fail fast
    |--------------------------------------------------------------------------
    |
    | The application should not run without a database connection.
    |
    */

    process.exit(1);
  }
}

module.exports = connectToDB;