/* global process  __dirname*/
// JWT and Content-Type
const jwt = require('jsonwebtoken');
//const contentType = require('content-type');

// path
const path = require('path');

const bcryptjs = require('bcryptjs');

// logger
const logger = require('../../logger');

// User Model
const User = require('../../models/userModel');

// // JSON Body Parser
const jsonBody = require('../../helper/jsonBodyParser');

// Send Email
const { sendEmail } = require('../../helper/mailer');

// Express and Router
const express = require('express');
const router = express.Router();

// Getting success response
const { createSuccessResponse, createErrorResponse } = require('../../response');

// router.post('/login', jsonBody(), (req, res) => {
//   const { email, password } = req.body;

//   User.findOne({ email }).then((user) => {
//     if (!user) {
//       res.status(400).json(createErrorResponse({ message: 'User does not exist' }));
//       return;
//     }

//     bcryptjs.compare(password, user.password).then((isMatch) => {
//       if (!isMatch) {
//         res.status(400).json(createErrorResponse({ message: 'Invalid credentials' }));
//         return;
//       }

//       const payload = { user: email };
//       const token = jwt.sign(payload, process.env.JWT_SECRET);
//       res.status(200).json(
//         createSuccessResponse({
//           message: 'Login successful',
//           token: token,
//         })
//       );
//     });
//   });
// });

router.post('/login', jsonBody(), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(createErrorResponse(401, 'Incorrect password'));
    }

    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }); // Token expires in 24 hour

    res.status(200).json(
      createSuccessResponse({
        message: 'Login successful',
        token,
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse(500, 'Server error'));
  }
});

// router.post('/register', jsonBody(), async (req, res) => {
//   try {
//     const { email, password, firstName, lastName, PSW } = req.body;

//     const user = await User.findOne({ email });

//     if (user) {
//       res.status(400).json(createErrorResponse({ message: 'User already exists' }));
//       return;
//     }

//     const salt = await bcryptjs.genSalt(10);
//     const hashedPassword = await bcryptjs.hash(password, salt);

//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       fname: firstName,
//       lname: lastName,
//       isPSW: PSW,
//     });

//     newUser.save().then((user) => {
//       logger.debug(`User created: ${user}`);
//       logger.info(`User created`);
//       res.status(201).json(createSuccessResponse({ message: 'User created' }));
//     });
//   } catch (error) {
//     console.log(error);
//     logger.error(`Error creating user: ${error}`);
//     res.status(500).json(createErrorResponse({ message: 'Error creating user' }));
//   }
// });

router.post('/register', jsonBody(), async (req, res) => {
  try {
    const { email, password, firstName, lastName, PSW } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(createErrorResponse(400, 'User already exists'));
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email: email,
      password: hashedPassword,
      fname: firstName,
      lname: lastName,
      isPSW: PSW,
    });

    // Save the new user
    const savedUser = await newUser.save();
    const userId = savedUser.id;
    const userEmail = savedUser.email;
    const userFirstName = savedUser.fname;

    // Send email
    await sendEmail('VERIFY', userEmail, userId, userFirstName);

    logger.debug(`User created: ${savedUser}`);
    logger.info('User created successfully');
    res.status(201).json(createSuccessResponse({ message: 'User registered successfully' }));
  } catch (error) {
    console.error(error);
    logger.error(`Error creating user: ${error}`);
    res.status(500).json(createErrorResponse(500, 'Error creating user'));
  }
});

router.patch('/verifyemail', jsonBody(), async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json(createErrorResponse(400, 'No token provided'));
    }

    logger.debug(`Token: ${token}`);

    const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json(createErrorResponse(400, 'Invalid or expired token'));
    }

    logger.debug(`User: ${user}`);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return res.status(200).json(createSuccessResponse({ message: 'Email verified successfully' }));
  } catch (error) {
    console.error(error);
    logger.error(`Error verifying email: ${error}`);
    res.status(500).json(createErrorResponse(500, 'Error verifying email'));
  }
});

router.post('/passwordreset', jsonBody(), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(createErrorResponse(400, 'No email provided'));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(createErrorResponse(404, 'User not found'));
    }

    const userId = user.id;
    const userEmail = user.email;
    const userFirstName = user.fname;

    await sendEmail('RESET', userEmail, userId, userFirstName);

    logger.info('Forgot password token created and sent');

    return res
      .status(200)
      .json(
        createSuccessResponse({ message: `Forgot password token created and sent to ${userEmail}` })
      );
  } catch (error) {
    logger.error(`Error creating forgot/reset password token: ${error}`);
    res.status(500).json(createErrorResponse(500, 'Error sending email'));
  }
});

router.get('/passwordreset', async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(400).json(createErrorResponse(400, 'No token provided'));
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json(createErrorResponse(400, 'Invalid or expired token'));
    }

    return res.status(200).json(createSuccessResponse({ message: 'Token is valid' }));
  } catch (error) {
    logger.error(`Error verifying reset password token: ${error}`);
    res.status(500).json(createErrorResponse(500, 'Error verifying token'));
  }
});

router.patch('/passwordreset', jsonBody(), async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json(createErrorResponse(400, 'No token provided'));
    }

    if (!password) {
      return res.status(400).json(createErrorResponse(400, 'No password provided'));
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json(createErrorResponse(400, 'Invalid or expired token'));
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return res.status(200).json(createSuccessResponse({ message: 'Password reset successfully' }));
  } catch (error) {
    logger.error(`Error resetting password: ${error}`);
    res.status(500).json(createErrorResponse(500, 'Error resetting password'));
  }
});

router.get('/help', async (req, res) => {
  try {
    const type = req.query.type;
    let helpFilePath;
    if (type === 'md') {
      helpFilePath = path.join(__dirname, '../../documentation/Auth_API_Documentation.md');
    } else {
      helpFilePath = path.join(__dirname, '../../documentation/Auth_API_Documentation.html');
    }
    res.status(200).sendFile(helpFilePath);
  } catch (error) {
    logger.error(`Error getting help: ${error}`);
    res.status(500).json(createErrorResponse(500, 'Error getting help'));
  }
});

module.exports = router;
