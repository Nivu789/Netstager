const nodemailer = require('nodemailer')

const sendVerificationEmail = async(email,token) =>{
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
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
    
      return transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail

