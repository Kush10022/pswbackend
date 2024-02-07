/* global process */
const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');
const logger = require('../logger');
const User = require('../models/userModel');

async function updateUserWithToken(userId, tokenDetails) {
  try {
    await User.findByIdAndUpdate(userId, tokenDetails);
  } catch (error) {
    logger.error(`Error updating user ${userId}: ${error}`);
    throw new Error('Failed to update user token details.');
  }
}

async function createTransporter() {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });

  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        logger.error(`Transporter verification failed: ${error}`);
        reject(new Error('Email transporter configuration is invalid.'));
      } else {
        logger.debug('Transporter is ready to take messages.' + success);
        resolve(transporter);
      }
    });
  });
}

async function sendMail(transporter, mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(`Error sending email: ${err}`);
        reject(new Error('Failed to send email.'));
      } else {
        logger.debug(`Email sent: ${info.response}`);
        resolve(info);
      }
    });
  });
}

async function sendEmail(emailType, userEmail, userId, firstName) {
  try {
    if (emailType !== 'VERIFY' && emailType !== 'RESET') {
      throw new Error('Invalid email type');
    }

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      await updateUserWithToken(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === 'RESET') {
      await updateUserWithToken(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = await createTransporter();
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
            `, // Use the same HTML content
    };

    await sendMail(transporter, mailOptions);
  } catch (error) {
    logger.error(`sendEmail failed: ${error}`);
    throw error; // Re-throw the error if you want the caller to handle it
  }
}

module.exports = { sendEmail };