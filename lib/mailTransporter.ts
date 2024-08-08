import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '0'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})