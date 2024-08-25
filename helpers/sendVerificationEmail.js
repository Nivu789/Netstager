const nodemailer = require('nodemailer')

const sendVerificationEmail = async(email,token) =>{
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      tls: {
        ciphers: 'SSLv3',
      },
      port: 465,
      secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        text: `Please verify your email by clicking the following link: 
               ${process.env.BASE_URL}/verify-email?token=${token}`,
      };
    
      await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail

