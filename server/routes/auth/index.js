require('dotenv').config();

const _ = require('lodash');
const nodemailer = require('nodemailer');
const { User } = require('../../models/user');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

let verificationCodes = new Map();
let verified = new Set([]);

router.route('/getVerificationCode').post(async (req, res) => {
  const re = new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`);
  if (!req.body.email.match(re)) {
    return res.status(400).send({ status: 'fail', msg: 'Invalid Email' });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({ status: 'fail', msg: 'Duplicate Email' });
  }

  const code = _.random(100000, 999999);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'no-reply-dinewise@gmail.com',
    to: req.body.email,
    subject: 'Your verification code for DineWise',
    html: `<p>Hello,</p>
              <br/>
              <p>Thank you for choosing DineWise.</p>
              <p>To verify your account, please enter the following code in the app:</p>
              <p><strong>${code}</strong></p>
              <p>This code will expire in 5 minutes.</p>
              <p>Please do not reply to this email. This mailbox is not monitored and you will not receive a response.</p>
              <br/>
              <p>Thank you,</p>
              <p>DineWise</p>`,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
      res.status(500).send({ status: 'error', msg: 'Internal Server Error' });
    } else {
      verificationCodes.set(req.body.email, code);
      setTimeout(
        () => {
          verificationCodes.delete(req.body.email);
        },
        1000 * 60 * 5
      );
      res
        .status(200)
        .send({ status: 'success', msg: 'Verification Code Sent' });
    }
  });
});

router.route('/verify').post(async (req, res) => {
  if (verificationCodes.get(req.body.email) == req.body.verificationCode) {
    verificationCodes.delete(req.body.email);
    verified.add(req.body.email);
    res.status(200).send({ status: 'success' });
  } else {
    res
      .status(401)
      .send({ status: 'fail', msg: 'Wrong or expired verification code' });
  }
});

router.route('/signup').post(async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const token = user.createJWT();
    verified.delete(req.body.email);

    return res
      .status(201)
      .json({ status: 'success', msg: 'Signup successful', token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'error',
        msg: 'Duplicate Email',
      });
    } else if (error.name == 'ValidationError') {
      return res
        .status(403)
        .json({ status: 'error', error: error.name, msg: error.message });
    } else {
      res.status(400).json({ status: 'error', msg: error.message });
    }
  }
});

router.route('/login').post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: 'fail', msg: 'incorrect credentials' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ status: 'fail', msg: 'incorrect credentials' });
    }

    const token = user.createJWT();

    return res.status(200).json({ status: 'success', token });
  } catch (error) {
    return res.status(400).json({ status: 'error', msg: error.nessage });
  }
});

module.exports = router;
