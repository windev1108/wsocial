import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
// import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
// import { ApolloServer } from "apollo-server-express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
// @ts-ignore
import resolvers from "./graphql/resolvers/index.js";
// @ts-ignore
import typeDefs from "./graphql/schema/index.js";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { PubSub } from "graphql-subscriptions";
import { Server } from "socket.io";
import axios from "axios";
let users = [];
const main = async () => {
  dotenv.config();
  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.BASE_URL,
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("user-connected", ({ userId }) => {
      console.log(`Socket ${socket.id} connected`);
      socket.join(userId);
      const foundIndex = users.findIndex((u) => u.userId === userId);
      if (foundIndex !== -1) {
        users[foundIndex].socketId = socket.id;
        users[foundIndex].isOnline = true;
        users[foundIndex].lastTime = null;
      } else {
        users.push({
          userId,
          socketId: socket.id,
          isOnline: true,
          lastTime: null,
        });
      }
      console.log("users :", users);
      io.emit("users", users);
    });
    socket.on("sendMessage", ({ sender, receiverId, message }) => {
      socket.to(receiverId).emit("receive_message", {
        sender: {
          ...sender,
          isOnline: users.find((u) => u.userId === sender.id).isOnline,
          lastTime: users.find((u) => u.userId === sender.id).lastTime,
        },
        message,
      });
    });
    socket.on("userTyping", ({ sender, receiverId, isTyping }) => {
      socket.to(receiverId).emit("user-typing", { sender, isTyping });
    });
    socket.on("calling", ({ caller, receiverId }) => {
      socket.to(receiverId).emit("calling", {
        caller,
      });
    });
    socket.on("callAccepted", ({ peerId, callerId }) => {
      socket.to(callerId).emit("callAccepted", { peerId });
      console.log("acceptCall :", callerId);
      console.log("peerId :", peerId);
    });
    socket.on("rejectCall", ({ callerId }) => {
      console.log("rejectCall :", callerId);
      socket.to(callerId).emit("rejectCall");
    });
    socket.on("updateNotification", () => {
      socket.broadcast.emit("updateNotification");
    });
    socket.on("updatePost", () => {
      socket.broadcast.emit("updatePost");
    });
    socket.on("disconnect", () => {
      console.log("Socket " + socket.id + " disconnected");
      // remove saved socket from users object
      const foundIndex = users.findIndex((u) => u.socketId === socket.id);
      if (foundIndex !== -1) {
        users[foundIndex].isOnline = false;
        users[foundIndex].lastTime = new Date();
      }
      console.log("users :", users);
      io.emit("users", users);
    });
  });
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });
  // Context parameters
  const prisma = new PrismaClient();
  const pubsub = new PubSub();
  const getSubscriptionContext = async (ctx) => {
    ctx;
    // ctx is the graphql-ws Context where connectionParams live
    if (ctx.connectionParams && ctx.connectionParams.session) {
      const { session } = ctx.connectionParams;
      return { session, prisma, pubsub };
    }
    // Otherwise let our resolvers know we don't have a current user
    return { session: null, prisma, pubsub };
  };
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx) => {
        // This will be run every time the client sends a subscription request
        // Returning an object will add that information to our
        // GraphQL context, which all of our resolvers have access to.
        return getSubscriptionContext(ctx);
      },
    },
    wsServer
  );
  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  const corsOptions = {
    origin: process.env.BASE_URL,
    credentials: true,
  };
  app.use(
    "/graphql",
    cors(corsOptions),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const res = await axios.get(`${process.env.BASE_URL}/api/auth/session`);
        console.log("res", res);
        console.log("req", req);
        return { session: res.data, prisma, pubsub };
      },
    })
  );
  const PORT = process.env.PORT || 5000;
  // Now that our HTTP server is fully set up, we can listen to it.
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`Server is now running on port ${PORT}`);
};
main().catch((err) => console.log(err));
