import express from 'express';
import http from 'http';
import cors from 'cors';
import dotnev from 'dotenv';

//for user auth 
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";

import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from '@apollo/server/standalone';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js"

import {connectDB} from './db/connectDB.js'
import { configurePassport } from './passport/passport.config.js';


dotnev.config();
configurePassport();

const app = express();
const httpServer = http.createServer(app); 

//initialise mongoDB sessions 
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.Mongo_URI,
  collection: "sessions",
})

//error handling, if store returns error
store.on("error", (err) => console.log(err));

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

app.use(

  session({
    secret: process.env.SESSION_SECRET, 
    resave: false, //this option specifies whether to save the session to the store on every request
    saveUninitialized: false, //option specifies wheter to save uninitialised sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true, //this option prevents the Cross_Site Scripting (XSS) attacks
    },
    store: store
  })
)

//initialise passport
app.use(passport.initialize())
app.use(passport.session())

//ensure we wait our middlewear to start
await server.start();

//set up our Express middleware to handle CORS, body parser, and our expressMiddlewear func
//context is an object that is shared across all resolvers
app.use('/',
  cors({
    origin: "http://localhost:3000",
    credentials: true,   //we can send coockies alongside our auth request
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => buildContext({req, res }),
  }),
);

await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
console.log(`🚀 Server ready at http://localhost:4000/`);