"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@graphql-tools/schema");
const client_1 = require("@prisma/client");
// import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
// import { ApolloServer } from "apollo-server-express";
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = require("express");
const http_1 = require("http");
const react_1 = require("next-auth/react");
// @ts-ignore
const index_ts_1 = require("./graphql/resolvers/index.ts");
// @ts-ignore
const index_ts_2 = require("./graphql/schema/index.ts");
const dotenv = require("dotenv");
const cors_1 = require("cors");
const body_parser_1 = require("body-parser");
const socket_io_1 = require("socket.io");
let users = [];
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv.config();
    // Create the schema, which will be used separately by ApolloServer and
    // the WebSocket server.
    const schema = (0, schema_1.makeExecutableSchema)({
        typeDefs: index_ts_2.default,
        resolvers: index_ts_1.default,
    });
    // Create an Express app and HTTP server; we will attach both the WebSocket
    // server and the ApolloServer to this HTTP server.
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer, {
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
            // remove saved socket from users object
            const foundIndex = users.findIndex(u => u.socketId === socket.id);
            if (foundIndex !== -1) {
                users[foundIndex].isOnline = false;
                users[foundIndex].lastTime = new Date();
            }
            console.log("users :", users);
            io.emit("users", users);
        });
    });
    // Context parameters
    const prisma = new client_1.PrismaClient();
    // Set up ApolloServer.
    const server = new server_1.ApolloServer({
        schema,
        csrfPrevention: true,
    });
    yield server.start();
    const corsOptions = {
        origin: process.env.BASE_URL,
        credentials: true,
    };
    app.use("/graphql", (0, cors_1.default)(corsOptions), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
            const session = yield (0, react_1.getSession)({ req });
            return { session: session, prisma };
        }),
    }));
    const PORT = process.env.PORT || 5000;
    // Now that our HTTP server is fully set up, we can listen to it.
    yield new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map