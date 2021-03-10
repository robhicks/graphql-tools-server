import { PubSub } from 'apollo-server-express';

export const pubsub = new PubSub();

export function uuid() {
  let d = new Date().getTime();
  const uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uid;
}

export const POST_ADDED = 'POST_ADDED';
