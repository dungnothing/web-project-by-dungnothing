import nodemailer from 'nodemailer'

export const sendEmail = async (to, subject, html) => {
  try {
    // Cấu hình transporter sử dụng Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS // App Password từ Gmail
      }
    })

    // Thiết lập nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    }

    // Gửi email
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw (error)
  }
}
