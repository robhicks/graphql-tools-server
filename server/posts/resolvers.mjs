import { pubsub, POST_ADDED, uuid } from "../Pub.mjs";

const db = {
  posts: []
}

export const addPost = async(parent, args = {}, context) => {
  const { content, tags } = args;

  const post = {
    created: Date.now(),
    content: content,
    id: uuid(),
    tags: tags || [],
    updated: Date.now()
  };

  db.posts.push(post)

  pubsub.publish(POST_ADDED, { postAdded: post });
  return post;
}

export async function posts(parent, args = {}, context) {
  return db.posts;
};

export const postAdded = {
  subcribe() {
    const asyncIterator = pubsub.asyncIterator(POST_ADDED);
    console.log(`asyncIterator`, asyncIterator)
    return asyncIterator;
  }
}