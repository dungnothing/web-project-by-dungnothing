import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadAvatarToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'avatars' },
      (error, uploaded) => {
        if (error) reject(new Error('Cloudinary upload failed'))
        else resolve(uploaded.secure_url)
      }
    )
    uploadStream.end(fileBuffer)
  })
}

export const uploadCardBackgroundToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'cardBackgrounds' },
      (error, uploaded) => {
        if (error) reject(new Error('Cloudinary upload failed'))
        else resolve(uploaded.secure_url)
      }
    )
    uploadStream.end(fileBuffer)
  })
}

export const deleteImageFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) reject(new Error('Cloudinary deletion failed'))
      else resolve(result)
    })
  })
}