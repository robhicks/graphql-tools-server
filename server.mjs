import { addResolversToSchema } from '@graphql-tools/schema';
import { ApolloServer, PubSub } from 'apollo-server-express';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { resolvers } from './server/resolvers.mjs';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express from 'express';
import expressJwt from "express-jwt";
import mongoose from 'mongoose';
import cors from "cors";

const dev = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});
global.db = mongoose.connection;

const schema = loadSchemaSync('./server/schema.graphql', { loaders: [new GraphQLFileLoader()] });
const schemaWithResolvers = addResolversToSchema({schema, resolvers});

const apolloServer = new ApolloServer({ 
  context: async ({req}) => {
    const { user } = req;
    const uri = `${req.protocol}://${req.hostname}:${PORT}${req.baseUrl}`;
    return { uri, user }
  },
  graphiql: true,
  schema: schemaWithResolvers,
  subscriptions: {
    path: '/subscriptions'
  }
});

const app = express();
if (dev) {
  app.use(cors());
}
app.use(expressJwt({
  secret: process.env.JWT_SIGNING_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false
}));

apolloServer.applyMiddleware({ app });

app.use(express.static('build'));

app.use((req, res, next) => {
  res.sendFile(join(__dirname, 'build', 'index.html'));
});

const server = createServer(app);
// global.pubsub = new RedisPubSub();
global.pubsub = new PubSub();

server.listen({ port: PORT }, () => {
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server
  });
  console.log(`web server ready at port:${PORT}`)
  console.log(`🚀 server ready at port:${PORT}${apolloServer.graphqlPath}`)
  console.log(`🚀 web socker server ready at port:${PORT}${apolloServer.subscriptionsPath}`)
});