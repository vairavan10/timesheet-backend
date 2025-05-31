const multer = require('multer');
const path = require('path');

// Configure storage location and filename for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder where images will be saved
  },
  filename: function (req, file, cb) {
    // Use Date.now() + original file extension to create unique filename
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter to accept only image files (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 } // max 2MB file size (optional)
});

module.exports = upload;
