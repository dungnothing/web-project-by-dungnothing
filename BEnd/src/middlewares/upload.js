import multer from 'multer'

// Chỉ chấp nhận các định dạng ảnh phổ biến
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and WebP files are allowed!'), false)
    }
    cb(null, true)
  }
})

export default upload
