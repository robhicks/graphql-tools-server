import mongoose from 'mongoose';
const { model, Schema } = mongoose;

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User'},
  channelId: { type: Schema.Types.ObjectId, ref: 'Channel'},
  content: String,
  created: Date,
  id: {type: String},
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag'}],
  thread: { type: Schema.Types.ObjectId, ref: 'Thread'},
  tags: [String],
  updated: {type: Date, default: Date.now },
});

const Post = model('Post', postSchema);

export default Post;