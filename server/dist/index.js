var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { createServer } from "http";
import { getSession } from "next-auth/react";
import resolvers from "./graphql/resolvers/index.ts";
import typeDefs from "./graphql/schema/index.ts";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
let users = [];
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv.config();
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.BASE_URL,
            methods: ["GET", "POST"]
        }
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
            }
            else {
                users.push({ userId, socketId: socket.id, isOnline: true, lastTime: null });
            }
            console.log("users :", users);
            io.emit("users", users);
        });
        socket.on("sendMessage", ({ sender, receiverId, message }) => {
            var _a, _b;
            socket.to(receiverId).emit("receive_message", {
                sender: Object.assign(Object.assign({}, sender), { isOnline: (_a = users.find(u => u.userId === sender.id)) === null || _a === void 0 ? void 0 : _a.isOnline, lastTime: (_b = users.find(u => u.userId === sender.id)) === null || _b === void 0 ? void 0 : _b.lastTime }), message
            });
        });
        socket.on("userTyping", ({ sender, receiverId, isTyping }) => {
            socket.to(receiverId).emit("user-typing", { sender, isTyping });
        });
        socket.on("calling", ({ caller, receiverId }) => {
            socket.to(receiverId).emit("calling", {
                caller
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
        socket.on('disconnect', () => {
            console.log('Socket ' + socket.id + ' disconnected');
            const foundIndex = users.findIndex(u => u.socketId === socket.id);
            if (foundIndex !== -1) {
                users[foundIndex].isOnline = false;
                users[foundIndex].lastTime = new Date();
            }
            console.log("users :", users);
            io.emit("users", users);
        });
    });
    const prisma = new PrismaClient();
    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
    });
    yield server.start();
    const corsOptions = {
        origin: process.env.BASE_URL,
        credentials: true,
    };
    app.use("/graphql", cors(corsOptions), bodyParser.json(), expressMiddleware(server, {
        context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
            const session = yield getSession({ req });
            return { session: session, prisma };
        }),
    }));
    const PORT = process.env.PORT || 5000;
    yield new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
main().catch((err) => console.log(err));
