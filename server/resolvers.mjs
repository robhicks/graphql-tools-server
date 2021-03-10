import { addPost, postAdded, posts } from './posts/resolvers.mjs';

export const resolvers = {
  Mutation: {
    addPost
  },
  Query: {
    posts
  },
  Subscription: {
    postAdded
  }
}