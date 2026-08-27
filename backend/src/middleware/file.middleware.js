const multer = require("multer");

/*
|--------------------------------------------------------------------------
| File Upload Configuration
|--------------------------------------------------------------------------
|
| Resume files are stored in memory because they are processed directly
| by the application instead of being permanently stored on the server.
|
*/

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB
  },

  /*
  |--------------------------------------------------------------------------
  | File Type Validation
  |--------------------------------------------------------------------------
  |
  | Only PDF and Microsoft Word documents are accepted as resumes.
  |
  */

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only PDF and Word document files are allowed."
        )
      );
    }

    cb(null, true);
  },
});

module.exports = upload;