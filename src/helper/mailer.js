/* global process */

//Nodemailer for sending emails
const nodemailer = require('nodemailer');

// User model for getting user details
const logger = require('../logger');
const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

async function sendEmail(emailType, userEmail, userId, firstName) {
  try {
    if (emailType !== 'VERIFY' && emailType !== 'RESET') {
      logger.error('Invalid email type');
      throw new Error('Invalid email type');
    }

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // const transport = nodemailer.createTransport({
    //   host: process.env.MAILTRAP_HOST,
    //   port: process.env.MAILTRAP_PORT,
    //   auth: {
    //     user: process.env.MAILTRAP_USER,
    //     pass: process.env.MAILTRAP_PASS,
    //   },
    // });

    // const transport = nodemailer.createTransport({
    //     host: "sandbox.smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //       user: "9b9a220749e0d2",
    //       pass: "d04251ed3911f3"
    //     }
    //   });

    const Transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });

    const mailOptions = {
      from: { name: 'PSW Project Dev Team', address: process.env.MAILER_USER },
      to: userEmail,
      subject: emailType === 'VERIFY' ? 'Email Verification Required' : 'Password Reset Request',
      html: `
        <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #333;">
          <h2 style="color: #0056b3;">Hello ${firstName},</h2>
          <p>This email is intended for the recipient with the email address: <strong>${userEmail}</strong>. If you have received this email in error, please disregard it.</p>
          <p>To ${emailType === 'VERIFY' ? 'complete your email verification' : 'proceed with resetting your password'}, please click on the button below:</p>
          <div style="margin: 25px 0;">
            <a href="${emailType === 'VERIFY' ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}` : `${process.env.DOMAIN}/passwordreset?token=${hashedToken}`}" style="background-color: #0056b3; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">${emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password'}</a>
          </div>
          <p>If the above button does not work, please copy and paste the following URL into your browser:</p>
          <p><a href="${emailType === 'VERIFY' ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}` : `${process.env.DOMAIN}/passwordreset?token=${hashedToken}`}">${emailType === 'VERIFY' ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}` : `${process.env.DOMAIN}/passwordreset?token=${hashedToken}`}</a></p>
          <p>Should you encounter any issues or have any questions, please do not hesitate to contact us.</p>
          <p>Best regards,</p>
          <p>PSW Project Development Team</p>
        </div>
      `,
    };
    

    Transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(err);
      } else {
        logger.debug(info);
        return info;
      }
    });
  } catch (error) {
    logger.error(error);
    return;
  }
}

module.exports = { sendEmail };
