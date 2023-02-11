import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
// import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
// import { ApolloServer } from "apollo-server-express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { createServer } from "http";
import { getSession } from "next-auth/react";
// @ts-ignore
import resolvers from "./graphql/resolvers/index.ts";
// @ts-ignore
import typeDefs from "./graphql/schema/index.ts";
// @ts-ignore
import type { GraphQLContext, PeerUser, Session, SocketUser } from "./utils/types.ts";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Server, Socket } from "socket.io";

let users: SocketUser[] = []


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
      methods: ["GET", "POST"]
    }
  })



  io.on("connection", (socket: Socket) => {
    socket.on("user-connected", ({ userId }: { userId: string }) => {
      console.log(`Socket ${socket.id} connected`);
      socket.join(userId);
      const foundIndex = users.findIndex((u) => u.userId === userId)
      if (foundIndex !== -1) {
        users[foundIndex]!.socketId = socket.id
        users[foundIndex]!.isOnline = true
        users[foundIndex]!.lastTime = null
      } else {
        users.push({ userId, socketId: socket.id, isOnline: true, lastTime: null })
      }
      console.log("users :", users);
      io.emit("users", users)
    })

    socket.on("sendMessage", ({ sender, receiverId, message }: { sender: any, receiverId: string, message: string }) => {
      socket.to(receiverId).emit("receive_message", {
        sender: {
          ...sender,
          isOnline: users.find(u => u.userId === sender.id)?.isOnline,
          lastTime: users.find(u => u.userId === sender.id)?.lastTime
        }, message
      })
    })

    socket.on("userTyping", ({ sender, receiverId, isTyping }: { sender: any, receiverId: string, isTyping: boolean }) => {
      socket.to(receiverId).emit("user-typing", { sender, isTyping })
    })

    socket.on("calling", ({ caller, receiverId }: { caller: PeerUser, receiverId: string }) => {
      socket.to(receiverId).emit("calling", {
        caller
      })
    })

    socket.on("callAccepted", ({ peerId, callerId }: { peerId: string, callerId: string }) => {
      socket.to(callerId).emit("callAccepted" , { peerId })
      console.log("acceptCall :", callerId);
      console.log("peerId :", peerId);
    })

    socket.on("rejectCall", ({ callerId }: { callerId: string }) => {
      console.log("rejectCall :", callerId);
      socket.to(callerId).emit("rejectCall")
    })


    socket.on("updateNotification", () => {
      socket.broadcast.emit("updateNotification")
    })

    socket.on("updatePost", () => {
      socket.broadcast.emit("updatePost")
    })

    socket.on('disconnect', () => {
      console.log('Socket ' + socket.id + ' disconnected');
      // remove saved socket from users object
      const foundIndex = users.findIndex(u => u.socketId === socket.id)
      if (foundIndex !== -1) {
        users[foundIndex]!.isOnline = false
        users[foundIndex]!.lastTime = new Date()
      }
      console.log("users :", users);
      io.emit("users", users)
    });
  })


  // Context parameters
  const prisma = new PrismaClient();

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
  });
  await server.start();

  const corsOptions = {
    origin: process.env.BASE_URL,
    credentials: true,
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = await getSession({ req });

        return { session: session as Session, prisma };
      },
    })
  );

  const PORT = process.env.PORT || 5000;

  // Now that our HTTP server is fully set up, we can listen to it.
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
};

main().catch((err) => console.log(err));
