import { GraphQLServer, PubSub } from 'graphql-yoga'
import * as express from 'express';
const session = require('express-session');
import { importSchema } from 'graphql-import'
import { resolvers, fragmentReplacements } from './resolvers/index'
import prisma from './prisma'

const typeDefs = importSchema("./src/typeDefs/schema.graphql");

const pubsub = new PubSub();
const IN_PROD = process.env.NODE_ENV === 'production';

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    playground: !IN_PROD,
    context(request) {
        return {
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
});

// Set Session - This is important for server side rendering projects
// So I can either authorize with token or session
server.express.use(
    session({
        name: "qid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: IN_PROD,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 Days 
        }
    })
);

server.express.disable("x-powered-by"); //Disable "X-Powered-By" header

server.express.use("/uploads", express.static("uploads")); //Allow for file upload

export { server as default }