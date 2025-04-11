import multer from "multer";
import path from "path";
import fs from 'fs';

// Ensure 'uploads' directory exists
const uploadDir = path.join('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Store uploads temporarily
const profileImagestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const profileImageFileFilter = (req, file, cb) => {
  // Accept only images
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

export const uploadProfileImage = multer({ storage: profileImagestorage, fileFilter: profileImageFileFilter });
