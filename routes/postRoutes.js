import express from 'express';
import * as dotenv from 'dotenv';

import { v2 as cloudinary } from 'cloudinary';
import Post from '../mongodb/models/post.js';
import multer from 'multer';
dotenv.config();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
const router = express.Router();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
router.route('/').get(async function (req, res) {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
});

router.route('/').post(async function (req, res) {
  try {
    const { name, prompt, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    })
      .then(function () {
        res.status(200).send({ success: true });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send(error);
      });
  } catch (error) {
    console.log(error);
    res.status(501).send({ success: false, data: error });
  }
});

export default router;
