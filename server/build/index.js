"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("@graphql-tools/schema");
var client_1 = require("@prisma/client");
var server_1 = require("@apollo/server");
var express4_1 = require("@apollo/server/express4");
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var react_1 = require("next-auth/react");
// @ts-ignore
var index_ts_1 = __importDefault(require("./graphql/resolvers/index.js"));
// @ts-ignore
var index_ts_2 = __importDefault(require("./graphql/schema/index.js"));
var dotenv = __importStar(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var socket_io_1 = require("socket.io");
var users = [];
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var schema, app, httpServer, io, corsOptions, prisma, server, PORT;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dotenv.config();
                schema = (0, schema_1.makeExecutableSchema)({
                    typeDefs: index_ts_2.default,
                    resolvers: index_ts_1.default,
                });
                app = (0, express_1.default)();
                httpServer = (0, http_1.createServer)(app);
                io = new socket_io_1.Server(httpServer, {
                    cors: {
                        origin: process.env.BASE_URL,
                        methods: ["GET", "POST"]
                    }
                });
                io.on("connection", function (socket) {
                    socket.on("user-connected", function (_a) {
                        var userId = _a.userId;
                        console.log("Socket ".concat(socket.id, " connected"));
                        socket.join(userId);
                        var foundIndex = users.findIndex(function (u) { return u.userId === userId; });
                        if (foundIndex !== -1) {
                            users[foundIndex].socketId = socket.id;
                            users[foundIndex].isOnline = true;
                            users[foundIndex].lastTime = null;
                        }
                        else {
                            users.push({ userId: userId, socketId: socket.id, isOnline: true, lastTime: null });
                        }
                        console.log("users :", users);
                        io.emit("users", users);
                    });
                    socket.on("sendMessage", function (_a) {
                        var _b, _c;
                        var sender = _a.sender, receiverId = _a.receiverId, message = _a.message;
                        socket.to(receiverId).emit("receive_message", {
                            sender: __assign(__assign({}, sender), { isOnline: (_b = users.find(function (u) { return u.userId === sender.id; })) === null || _b === void 0 ? void 0 : _b.isOnline, lastTime: (_c = users.find(function (u) { return u.userId === sender.id; })) === null || _c === void 0 ? void 0 : _c.lastTime }),
                            message: message
                        });
                    });
                    socket.on("userTyping", function (_a) {
                        var sender = _a.sender, receiverId = _a.receiverId, isTyping = _a.isTyping;
                        socket.to(receiverId).emit("user-typing", { sender: sender, isTyping: isTyping });
                    });
                    // socket.on("calling", ({ caller, receiverId , channelId , token}: { caller: PeerUser, receiverId: string , channelId: string, token: string}) => {
                    //   socket.to(receiverId).emit("calling", {
                    //     caller,
                    //     channelId,
                    //     token
                    //   })
                    // })
                    // socket.on("callAccepted", ({ peerId, callerId }: { peerId: string, callerId: string }) => {
                    //   socket.to(callerId).emit("callAccepted" , { peerId })
                    //   console.log("acceptCall :", callerId);
                    //   console.log("peerId :", peerId);
                    // })
                    // socket.on("rejectCall", ({ callerId }: { callerId: string }) => {
                    //   console.log("rejectCall :", callerId);
                    //   socket.to(callerId).emit("rejectCall")
                    // })
                    socket.on("updateNotification", function () {
                        socket.broadcast.emit("updateNotification");
                    });
                    socket.on("updatePost", function () {
                        socket.broadcast.emit("updatePost");
                    });
                    socket.on('disconnect', function () {
                        console.log('Socket ' + socket.id + ' disconnected');
                        // remove saved socket from users object
                        var foundIndex = users.findIndex(function (u) { return u.socketId === socket.id; });
                        if (foundIndex !== -1) {
                            users[foundIndex].isOnline = false;
                            users[foundIndex].lastTime = new Date();
                        }
                        console.log("users :", users);
                        io.emit("users", users);
                    });
                });
                corsOptions = {
                    origin: process.env.BASE_URL,
                    credentials: true,
                };
                prisma = new client_1.PrismaClient();
                server = new server_1.ApolloServer({
                    schema: schema,
                    csrfPrevention: true,
                });
                return [4 /*yield*/, server.start()];
            case 1:
                _a.sent();
                app.use("/graphql", (0, cors_1.default)(corsOptions), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
                    context: function (_a) {
                        var req = _a.req;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var session;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, react_1.getSession)({ req: req })];
                                    case 1:
                                        session = _b.sent();
                                        return [2 /*return*/, { session: session, prisma: prisma }];
                                }
                            });
                        });
                    },
                }));
                PORT = process.env.PORT || 5000;
                // Now that our HTTP server is fully set up, we can listen to it.
                return [4 /*yield*/, new Promise(function (resolve) {
                        return httpServer.listen({ port: PORT }, resolve);
                    })];
            case 2:
                // Now that our HTTP server is fully set up, we can listen to it.
                _a.sent();
                console.log("Server is now running on http://localhost:".concat(PORT, "/graphql"));
                return [2 /*return*/];
        }
    });
}); };
main().catch(function (err) { return console.log(err); });
