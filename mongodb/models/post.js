import mongoose from 'mongoose';

const Post = new mongoose.Schema({
  name: { type: String, requied: true },
  prompt: { type: String, required: true },
  photo: { type: String },
});
const PostSchema = mongoose.model('Post', Post);
export default PostSchema;
