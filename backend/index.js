import express from "express";
import http from "http";
import cors from "cors";
import dotnev from "dotenv";
import path from "path";

//for user auth
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";
import job from './cron.js';

dotnev.config();
configurePassport();
job.start();

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);

//initialise mongoDB sessions
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//console.log(store);

//error handling, if store returns error
store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //this option specifies whether to save the session to the store on every request
    saveUninitialized: false, //option specifies wheter to save uninitialised sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true, //this option prevents the Cross_Site Scripting (XSS) attacks
    },
    store: store,
  })
);

//initialise passport
app.use(passport.initialize());
app.use(passport.session());

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

//ensure we wait our middlewear to start
await server.start();



//set up our Express middleware to handle CORS, body parser, and our expressMiddlewear func
//context is an object that is shared across all resolvers
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:4000",
    credentials: true, //we can send coockies alongside our auth request
  }),
  express.json(),
  expressMiddleware(server, {
		context: async ({ req, res }) => buildContext({ req, res }),
	})
);

app.use(express.static(path.join(__dirname, "frontend/dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"))
})

await new Promise((resolve) => httpServer.listen({ port: 3000 }, resolve));
await connectDB();
console.log(`🚀 Server ready at http://localhost:3000/graphql`);
