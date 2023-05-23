import express from 'express';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../mongodb/models/user.js';
import multer from 'multer';
dotenv.config();

const router = express.Router();

router.route('/login').post(async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await Post.findOne({ email: email });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error });
  }
});

router.route('/createaccount').post(async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const existEmail = new Promise(async function (resolve, reject) {
      const emailexist = await User.findOne({ email });

      if (emailexist) reject('Email already exists');

      resolve();
    });
    Promise.all([existEmail])
      .then(function () {
        bcrypt.hash(password, 10).then(async function (hashedPassword) {
          const newUser = await User.create({
            name,
            email,
            hashedPassword,
          })
            .then(function () {
              res.status(200).send({ success: true });
            })
            .catch(function (error) {
              console.log(error);
              res.status(500).send(error);
            });
        });
      })
      .catch(function (error) {
        return res.status(502).send('Email exist');
      });
  } catch (error) {
    console.log(error);
    res.status(501).send({ success: false, data: error });
  }
});

export default router;
