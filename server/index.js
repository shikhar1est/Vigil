// server/index.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import connectDB from './config/db.js';
import { typeDefs } from './graphql/typeDefs.js';     // <-- Import
import { resolvers } from './graphql/resolvers.js';   // <-- Import

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: false,
});

await server.start();

app.use('/graphql', cors(), express.json(), expressMiddleware(server));

const PORT = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);