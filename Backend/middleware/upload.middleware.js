import multer from 'multer';

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/images/'),
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // use original file name directly
  }
});
const upload = multer({ storage });

export default upload;
