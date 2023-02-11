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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var graphql_1 = require("graphql");
var prisma = new client_1.PrismaClient();
var resolvers = {
    Query: {
        getUsers: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, prisma.user.findMany()];
                case 1: return [2, _a.sent()];
            }
        }); }); },
        getUserById: function (_parent, _a, context) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, user;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            return [4, prisma.user.findUnique({
                                    where: {
                                        id: id,
                                    },
                                    include: {
                                        _count: {
                                            select: {
                                                followers: true,
                                                followings: true,
                                            },
                                        },
                                        friends: {
                                            select: {
                                                id: true,
                                            },
                                        },
                                        notificationsFrom: {
                                            select: {
                                                type: true,
                                                toUserId: true,
                                                fromUsers: {
                                                    select: {
                                                        id: true,
                                                    },
                                                },
                                            },
                                        },
                                        notificationsTo: {
                                            select: {
                                                fromUsers: {
                                                    select: {
                                                        id: true,
                                                    },
                                                },
                                                type: true,
                                                toUserId: true,
                                            },
                                        },
                                        followers: {
                                            select: {
                                                id: true,
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            user = _c.sent();
                            return [2, __assign(__assign({}, user), { isMySelf: id === ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id), isFriend: user === null || user === void 0 ? void 0 : user.friends.some(function (user) { var _a; return user.id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id); }), isSendAddFriend: user === null || user === void 0 ? void 0 : user.notificationsTo.some(function (notification) {
                                        return notification.toUserId === id &&
                                            notification.fromUsers.some(function (user) { var _a; return user.id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id); }) &&
                                            notification.type === "ADD_FRIEND";
                                    }), isReceiveAddFriend: user === null || user === void 0 ? void 0 : user.notificationsFrom.some(function (notification) {
                                        var _a;
                                        return notification.toUserId === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id) &&
                                            notification.fromUsers.some(function (user) { return user.id === id; }) &&
                                            notification.type === "ADD_FRIEND";
                                    }), isFollowing: user === null || user === void 0 ? void 0 : user.followers.some(function (user) { var _a; return user.id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id); }), _count: {
                                        followers: user === null || user === void 0 ? void 0 : user._count.followers,
                                        followings: user === null || user === void 0 ? void 0 : user._count.followings,
                                    } })];
                    }
                });
            });
        },
        getPosts: function (_parent, _a) {
            var userId = _a.userId;
            return __awaiter(void 0, void 0, void 0, function () {
                var _b, friends, followings, posts, customPosts;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, prisma.user.findUnique({
                                where: {
                                    id: userId,
                                },
                                select: {
                                    friends: {
                                        select: {
                                            id: true,
                                        },
                                    },
                                    followings: {
                                        select: {
                                            id: true,
                                        },
                                    },
                                },
                            })];
                        case 1:
                            _b = _c.sent(), friends = _b.friends, followings = _b.followings;
                            return [4, prisma.post.findMany({
                                    orderBy: {
                                        createdAt: "desc",
                                    },
                                    include: {
                                        _count: {
                                            select: {
                                                comments: true,
                                                postShared: true,
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            posts = _c.sent();
                            customPosts = posts
                                .filter(function (post) {
                                return friends.some(function (u) { return u.id === post.authorId; }) ||
                                    followings.some(function (u) { return u.id === post.authorId; }) ||
                                    (post.authorId === userId && post.viewer === "PRIVATE") ||
                                    userId === post.authorId;
                            })
                                .map(function (post) {
                                return __assign(__assign({}, post), { isMySelf: post.authorId !== userId && post.viewer === "PRIVATE" });
                            });
                            return [2, customPosts.filter(function (post) { return !post.isMySelf; })];
                    }
                });
            });
        },
        getPostById: function (_parent, args) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.post.findUnique({
                            where: {
                                id: args.id,
                            },
                            include: {
                                _count: {
                                    select: {
                                        comments: true,
                                        postShared: true,
                                    },
                                },
                            },
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        }); },
        findConversation: function (_, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var session, prisma, id_1, userId_1, conversations, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = context.session, prisma = context.prisma;
                        if (!(session === null || session === void 0 ? void 0 : session.user)) {
                            throw new graphql_1.GraphQLError("Not authorized");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        id_1 = session.user.id;
                        userId_1 = _args.userId;
                        return [4, prisma.conversation.findMany({
                                include: {
                                    messages: {
                                        select: {
                                            id: true,
                                            content: true,
                                            sender: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    image: true
                                                },
                                            },
                                            files: {
                                                select: {
                                                    publicId: true,
                                                    type: true,
                                                    url: true
                                                }
                                            }
                                        }
                                    },
                                    participants: {
                                        select: {
                                            id: true
                                        }
                                    }
                                }
                            })];
                    case 2:
                        conversations = _a.sent();
                        return [2, conversations.find(function (conversation) { return conversation.participants.some(function (p) { return p.id === id_1; }) && conversation.participants.some(function (p) { return p.id === userId_1; }); })];
                    case 3:
                        error_1 = _a.sent();
                        throw new graphql_1.GraphQLError(error_1 === null || error_1 === void 0 ? void 0 : error_1.message);
                    case 4: return [2];
                }
            });
        }); },
        conversations: function (_parent, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma_1, session_1, conversations, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        prisma_1 = context.prisma, session_1 = context.session;
                        if (!(session_1 === null || session_1 === void 0 ? void 0 : session_1.user)) {
                            throw new graphql_1.GraphQLError("Not authorized");
                        }
                        return [4, prisma_1.conversation.findMany({
                                where: {
                                    participants: {
                                        some: {
                                            id: {
                                                equals: (_a = session_1 === null || session_1 === void 0 ? void 0 : session_1.user) === null || _a === void 0 ? void 0 : _a.id
                                            }
                                        }
                                    },
                                },
                                include: {
                                    messages: {
                                        orderBy: {
                                            updatedAt: "desc"
                                        },
                                        select: {
                                            content: true,
                                            updatedAt: true,
                                            senderId: true
                                        }
                                    },
                                    participants: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true
                                        }
                                    },
                                },
                                orderBy: {
                                    updatedAt: "desc"
                                }
                            })];
                    case 1:
                        conversations = _b.sent();
                        return [2, conversations.map(function (conversation) {
                                return __assign(__assign({}, conversation), { latestMessage: conversation.messages[0], _count: {
                                        messages: conversation.messages.filter(function (message) { var _a; return (message === null || message === void 0 ? void 0 : message.senderId) !== ((_a = session_1 === null || session_1 === void 0 ? void 0 : session_1.user) === null || _a === void 0 ? void 0 : _a.id); }).length
                                    }, user: conversation.participants.filter(function (user) { var _a; return (user === null || user === void 0 ? void 0 : user.id) !== ((_a = session_1 === null || session_1 === void 0 ? void 0 : session_1.user) === null || _a === void 0 ? void 0 : _a.id); })[0] });
                            })];
                    case 2:
                        error_2 = _b.sent();
                        throw new graphql_1.GraphQLError(error_2.message);
                    case 3: return [2];
                }
            });
        }); }
    },
    User: {
        posts: function (_parent, _a) {
            var isMySelf = _a.isMySelf, isFriend = _a.isFriend;
            return __awaiter(void 0, void 0, void 0, function () {
                var posts, posts, posts;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!isMySelf) return [3, 2];
                            return [4, prisma.post.findMany({
                                    where: {
                                        authorId: _parent.id,
                                    },
                                    include: {
                                        _count: {
                                            select: {
                                                comments: true,
                                                postShared: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        updatedAt: "desc",
                                    },
                                })];
                        case 1:
                            posts = _b.sent();
                            return [2, posts];
                        case 2:
                            if (!isFriend) return [3, 4];
                            return [4, prisma.post.findMany({
                                    where: {
                                        authorId: _parent.id,
                                        viewer: {
                                            not: "PRIVATE",
                                        },
                                    },
                                    include: {
                                        _count: {
                                            select: {
                                                comments: true,
                                                postShared: true
                                            },
                                        },
                                    },
                                    orderBy: {
                                        updatedAt: "desc",
                                    },
                                })];
                        case 3:
                            posts = _b.sent();
                            return [2, posts];
                        case 4: return [4, prisma.post.findMany({
                                where: {
                                    authorId: _parent.id,
                                    viewer: {
                                        equals: "PUBLIC",
                                    },
                                },
                                include: {
                                    _count: {
                                        select: {
                                            comments: true,
                                            postShared: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    updatedAt: "desc",
                                },
                            })];
                        case 5:
                            posts = _b.sent();
                            return [2, posts];
                    }
                });
            });
        },
        friends: function (_parent, _args) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.user.findUnique({
                            where: { id: _parent.id },
                            select: { friends: true },
                        })];
                    case 1:
                        user = _a.sent();
                        return [2, user === null || user === void 0 ? void 0 : user.friends];
                }
            });
        }); },
        notFriends: function (_parent, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, session, users, userSession;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        prisma = context.prisma, session = context.session;
                        return [4, prisma.user.findMany({
                                where: {
                                    OR: {
                                        friends: {
                                            none: {
                                                id: _parent.id,
                                            },
                                        },
                                    },
                                    NOT: {
                                        id: _parent.id,
                                    },
                                },
                            })];
                    case 1:
                        users = _b.sent();
                        return [4, prisma.user.findFirst({
                                where: {
                                    id: (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id,
                                },
                                select: {
                                    notificationsFrom: {
                                        select: {
                                            type: true,
                                            toUserId: true,
                                            fromUsers: {
                                                select: {
                                                    id: true
                                                }
                                            }
                                        }
                                    },
                                    notificationsTo: {
                                        select: {
                                            type: true,
                                            toUserId: true,
                                            fromUsers: {
                                                select: {
                                                    id: true
                                                }
                                            }
                                        }
                                    }
                                }
                            })];
                    case 2:
                        userSession = _b.sent();
                        return [2, users.map(function (user) {
                                return __assign(__assign({}, user), { isSendAddFriend: userSession === null || userSession === void 0 ? void 0 : userSession.notificationsFrom.some(function (notification) {
                                        return notification.type === "ADD_FRIEND" && notification.toUserId === user.id;
                                    }), isReceiveAddFriend: userSession === null || userSession === void 0 ? void 0 : userSession.notificationsTo.some(function (notification) {
                                        return notification.toUserId === _parent.id &&
                                            notification.fromUsers.some(function (u) { return u.id === user.id; }) &&
                                            notification.type === "ADD_FRIEND";
                                    }) });
                            })];
                }
            });
        }); },
        followers: function (_parent, _args) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.user.findUnique({
                            where: { id: _parent.id },
                            select: { followers: true },
                        })];
                    case 1:
                        user = _a.sent();
                        return [2, user === null || user === void 0 ? void 0 : user.followers];
                }
            });
        }); },
        followings: function (_parent, _args) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.user.findUnique({
                            where: { id: _parent.id },
                            select: { followings: true },
                        })];
                    case 1:
                        user = _a.sent();
                        return [2, user === null || user === void 0 ? void 0 : user.followings];
                }
            });
        }); },
        notificationsFrom: function (_parent, _args) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.user.findUnique({
                            where: {
                                id: _parent.id,
                            },
                            select: {
                                notificationsFrom: {
                                    select: {
                                        fromUsers: {
                                            select: {
                                                id: true,
                                                name: true,
                                                image: true,
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        return [2, user === null || user === void 0 ? void 0 : user.notificationsFrom];
                }
            });
        }); },
        notificationsTo: function (_parent, _args) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.user.findUnique({
                            where: {
                                id: _parent.id,
                            },
                            select: {
                                notificationsTo: {
                                    include: {
                                        fromUsers: {
                                            select: {
                                                id: true,
                                                name: true,
                                                image: true,
                                            },
                                        },
                                        toUser: {
                                            select: {
                                                id: true,
                                                name: true,
                                                image: true,
                                            },
                                        },
                                    },
                                    orderBy: {
                                        updatedAt: "desc",
                                    },
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        return [2, user === null || user === void 0 ? void 0 : user.notificationsTo];
                }
            });
        }); },
    },
    Post: {
        author: function (_parent, _args) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.user.findUnique({
                            where: {
                                id: _parent.authorId,
                            },
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        }); },
        likes: function (_parent, _args) { return __awaiter(void 0, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.post.findUnique({
                            where: {
                                id: _parent.id,
                            },
                            select: {
                                likes: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        post = _a.sent();
                        return [2, post === null || post === void 0 ? void 0 : post.likes];
                }
            });
        }); },
        files: function (_parent, _args) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, prisma.file.findMany({
                            where: {
                                postId: _parent.id,
                            },
                        })];
                    case 1: return [2, _a.sent()];
                }
            });
        }); },
        comments: function (_parent, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, session, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma, session = context.session;
                        if (!(session === null || session === void 0 ? void 0 : session.user)) {
                            throw new graphql_1.GraphQLError("Not authorized");
                        }
                        return [4, prisma.post.findUnique({
                                where: {
                                    id: _parent.id,
                                },
                                select: {
                                    comments: {
                                        include: {
                                            childComment: {
                                                include: {
                                                    childComment: {
                                                        include: {
                                                            user: {
                                                                select: {
                                                                    id: true,
                                                                    name: true,
                                                                    image: true,
                                                                },
                                                            },
                                                            file: true,
                                                            likes: {
                                                                select: {
                                                                    id: true,
                                                                    name: true,
                                                                    image: true,
                                                                },
                                                            },
                                                            replyToUser: {
                                                                select: {
                                                                    id: true,
                                                                    name: true,
                                                                    image: true,
                                                                },
                                                            },
                                                        },
                                                        orderBy: {
                                                            createdAt: "desc",
                                                        },
                                                    },
                                                    user: {
                                                        select: {
                                                            id: true,
                                                            name: true,
                                                            image: true,
                                                        },
                                                    },
                                                    file: true,
                                                    likes: {
                                                        select: {
                                                            id: true,
                                                            name: true,
                                                            image: true,
                                                        },
                                                    },
                                                    replyToUser: {
                                                        select: {
                                                            id: true,
                                                            name: true,
                                                            image: true,
                                                        },
                                                    },
                                                },
                                                orderBy: {
                                                    createdAt: "desc",
                                                },
                                            },
                                            commentOf: {
                                                select: {
                                                    id: true,
                                                },
                                            },
                                            user: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    image: true,
                                                },
                                            },
                                            file: true,
                                            likes: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    image: true,
                                                },
                                            },
                                        },
                                        orderBy: {
                                            createdAt: "desc",
                                        },
                                    },
                                },
                            })];
                    case 1:
                        post = _a.sent();
                        return [2, post === null || post === void 0 ? void 0 : post.comments.filter(function (comment) { return comment.commentOf.length === 0; })];
                }
            });
        }); },
        postSharedOf: function (_parent, _args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma;
                        return [4, prisma.post.findUnique({
                                where: {
                                    id: _parent.id,
                                },
                                select: {
                                    postSharedOf: {
                                        select: {
                                            id: true,
                                            content: true,
                                            files: {
                                                select: {
                                                    id: true,
                                                    url: true,
                                                    type: true,
                                                    publicId: true,
                                                },
                                            },
                                            author: true,
                                            updatedAt: true,
                                            viewer: true,
                                            activity: true
                                        },
                                        orderBy: {
                                            updatedAt: "desc",
                                        },
                                    },
                                    _count: {
                                        select: {
                                            comments: true,
                                            postShared: true,
                                        },
                                    },
                                },
                            })];
                    case 1:
                        post = _a.sent();
                        return [2, post === null || post === void 0 ? void 0 : post.postSharedOf[0]];
                }
            });
        }); },
    },
    Mutation: {
        addFriendship: function (_parent, _a, context) {
            var userIdB = _a.userIdB;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, userASuccess, userBSuccess, notification;
                var _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            return [4, prisma.user.update({
                                    where: { id: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id },
                                    data: { friends: { connect: [{ id: userIdB }] } },
                                })];
                        case 1:
                            userASuccess = _g.sent();
                            return [4, prisma.user.update({
                                    where: { id: userIdB },
                                    data: { friends: { connect: [{ id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id }] } },
                                })];
                        case 2:
                            userBSuccess = _g.sent();
                            return [4, prisma.user.update({
                                    where: { id: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id },
                                    data: { followings: { connect: [{ id: userIdB }] } },
                                })];
                        case 3:
                            _g.sent();
                            return [4, prisma.user.update({
                                    where: { id: (_e = session === null || session === void 0 ? void 0 : session.user) === null || _e === void 0 ? void 0 : _e.id },
                                    data: { followers: { connect: [{ id: userIdB }] } },
                                })];
                        case 4:
                            _g.sent();
                            return [4, prisma.notification.findFirst({
                                    where: {
                                        toUserId: (_f = session === null || session === void 0 ? void 0 : session.user) === null || _f === void 0 ? void 0 : _f.id,
                                        fromUsers: {
                                            every: {
                                                id: userIdB,
                                            },
                                        },
                                        type: "ADD_FRIEND"
                                    },
                                    select: {
                                        id: true,
                                    },
                                })];
                        case 5:
                            notification = _g.sent();
                            return [4, prisma.notification.delete({
                                    where: {
                                        id: notification === null || notification === void 0 ? void 0 : notification.id,
                                    },
                                })];
                        case 6:
                            _g.sent();
                            return [2, {
                                    success: true,
                                    message: "".concat(userASuccess.name, " and  ").concat(userBSuccess.name, " have become friends"),
                                }];
                    }
                });
            });
        },
        removeFriendship: function (_parent, _a, context) {
            var userIdB = _a.userIdB;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, userASuccess, userBSuccess;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            return [4, prisma.user.update({
                                    where: { id: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id },
                                    data: { friends: { disconnect: [{ id: userIdB }] } },
                                })];
                        case 1:
                            userASuccess = _f.sent();
                            return [4, prisma.user.update({
                                    where: { id: userIdB },
                                    data: {
                                        friends: { disconnect: [{ id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id }] },
                                    },
                                })];
                        case 2:
                            userBSuccess = _f.sent();
                            return [4, prisma.user.update({
                                    where: { id: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id },
                                    data: { followings: { disconnect: [{ id: userIdB }] } },
                                })];
                        case 3:
                            _f.sent();
                            return [4, prisma.user.update({
                                    where: { id: (_e = session === null || session === void 0 ? void 0 : session.user) === null || _e === void 0 ? void 0 : _e.id },
                                    data: { followers: { disconnect: [{ id: userIdB }] } },
                                })];
                        case 4:
                            _f.sent();
                            return [2, {
                                    success: true,
                                    message: "".concat(userASuccess.name, " and  ").concat(userBSuccess.name, " have become strangers"),
                                }];
                    }
                });
            });
        },
        createPost: function (_parent, _a, context) {
            var post = _a.post;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, postShared, notification;
                var _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            if (!post.files) return [3, 2];
                            return [4, prisma.post.create({
                                    data: __assign(__assign({}, post), { authorId: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id, files: {
                                            createMany: {
                                                data: post.files,
                                            },
                                        } }),
                                    include: {
                                        files: true,
                                    },
                                })];
                        case 1:
                            _g.sent();
                            return [3, 12];
                        case 2:
                            if (!post.postIdShared) return [3, 10];
                            return [4, prisma.post.create({
                                    data: {
                                        content: post.content,
                                        viewer: post.viewer,
                                        authorId: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id,
                                        activity: "CREATED_POST",
                                        postSharedOf: {
                                            connect: {
                                                id: post.postIdShared,
                                            },
                                        },
                                    },
                                    select: {
                                        id: true,
                                        authorId: true,
                                        postSharedOf: {
                                            select: {
                                                authorId: true,
                                            },
                                        },
                                    },
                                })];
                        case 3:
                            postShared = _g.sent();
                            return [4, prisma.post.update({
                                    where: {
                                        id: post.postIdShared,
                                    },
                                    data: {
                                        postShared: {
                                            connect: {
                                                id: postShared === null || postShared === void 0 ? void 0 : postShared.id,
                                            },
                                        },
                                    },
                                })];
                        case 4:
                            _g.sent();
                            if (!(postShared.authorId !== (session === null || session === void 0 ? void 0 : session.user.id))) return [3, 9];
                            return [4, prisma.notification.findFirst({
                                    where: {
                                        fromUsers: {
                                            some: {
                                                id: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id,
                                            },
                                        },
                                        toUserId: postShared.postSharedOf[0].authorId,
                                        postId: post.postIdShared,
                                        type: "SHARE_POST",
                                    },
                                    select: {
                                        id: true,
                                    },
                                })];
                        case 5:
                            notification = _g.sent();
                            if (!notification) return [3, 7];
                            return [4, prisma.notification.update({
                                    where: {
                                        id: notification.id,
                                    },
                                    data: {
                                        updatedAt: new Date(),
                                    },
                                })];
                        case 6:
                            _g.sent();
                            return [3, 9];
                        case 7: return [4, prisma.notification.create({
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: (_e = session === null || session === void 0 ? void 0 : session.user) === null || _e === void 0 ? void 0 : _e.id,
                                        },
                                    },
                                    toUserId: postShared.postSharedOf[0].authorId,
                                    postId: post.postIdShared,
                                    type: "SHARE_POST",
                                },
                            })];
                        case 8:
                            _g.sent();
                            _g.label = 9;
                        case 9: return [2, {
                                success: true,
                                message: "Share post success",
                            }];
                        case 10: return [4, prisma.post.create({
                                data: __assign(__assign({}, post), { authorId: (_f = session === null || session === void 0 ? void 0 : session.user) === null || _f === void 0 ? void 0 : _f.id }),
                            })];
                        case 11:
                            _g.sent();
                            return [2, {
                                    success: true,
                                    message: "Created post successfully",
                                }];
                        case 12: return [2];
                    }
                });
            });
        },
        updatePost: function (_parent, _a, context) {
            var id = _a.id, post = _a.post;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            if (!post.files) return [3, 2];
                            return [4, prisma.post.update({
                                    where: {
                                        id: id,
                                    },
                                    data: __assign(__assign({}, post), { files: {
                                            deleteMany: {},
                                            createMany: {
                                                data: post.files,
                                            },
                                        } }),
                                    include: {
                                        files: true,
                                    },
                                })];
                        case 1:
                            _b.sent();
                            return [3, 4];
                        case 2: return [4, prisma.post.update({
                                where: {
                                    id: id,
                                },
                                data: __assign(__assign({}, post), { files: {
                                        deleteMany: {},
                                    } }),
                                include: {
                                    files: true,
                                },
                            })];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [2, {
                                success: true,
                                message: "Updated post successfully",
                            }];
                    }
                });
            });
        },
        deletePost: function (_parent, _a) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, prisma.post.delete({
                                where: {
                                    id: id,
                                },
                            })];
                        case 1:
                            _b.sent();
                            return [2, {
                                    success: true,
                                    message: "Deleted post successfully",
                                }];
                    }
                });
            });
        },
        updateUser: function (_parent, _a, context) {
            var user = _a.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var session, userUpdate, error_3;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            session = context.session;
                            return [4, prisma.user.update({
                                    where: {
                                        id: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id,
                                    },
                                    data: user,
                                })];
                        case 1:
                            userUpdate = _c.sent();
                            if (userUpdate) {
                                return [2, {
                                        success: true,
                                        message: "Updated user successfully",
                                    }];
                            }
                            else {
                                return [2, {
                                        success: false,
                                        message: "Updated user failed",
                                    }];
                            }
                            return [3, 3];
                        case 2:
                            error_3 = _c.sent();
                            return [2, {
                                    success: false,
                                    message: error_3.message,
                                }];
                        case 3: return [2];
                    }
                });
            });
        },
        toggleLikePost: function (_parent, _a, context) {
            var postId = _a.postId, authorId = _a.authorId, isLiked = _a.isLiked;
            return __awaiter(void 0, void 0, void 0, function () {
                var session, prisma, notification;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            session = context.session, prisma = context.prisma;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            if (!isLiked) return [3, 2];
                            return [4, prisma.post.update({
                                    where: {
                                        id: postId,
                                    },
                                    data: {
                                        likes: {
                                            disconnect: {
                                                id: session === null || session === void 0 ? void 0 : session.user.id,
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            _b.sent();
                            return [2, {
                                    success: true,
                                    message: "Unlike post success",
                                }];
                        case 2: return [4, prisma.post.update({
                                where: {
                                    id: postId,
                                },
                                data: {
                                    likes: {
                                        connect: {
                                            id: session === null || session === void 0 ? void 0 : session.user.id,
                                        },
                                    },
                                },
                            })];
                        case 3:
                            _b.sent();
                            if (!(authorId !== (session === null || session === void 0 ? void 0 : session.user.id))) return [3, 8];
                            return [4, prisma.notification.findFirst({
                                    where: {
                                        toUserId: authorId,
                                        postId: postId,
                                        type: "LIKE_POST",
                                    },
                                })];
                        case 4:
                            notification = _b.sent();
                            if (!!notification) return [3, 6];
                            return [4, prisma.notification.create({
                                    data: {
                                        fromUsers: {
                                            connect: {
                                                id: session === null || session === void 0 ? void 0 : session.user.id,
                                            },
                                        },
                                        toUserId: authorId,
                                        postId: postId,
                                        type: "LIKE_POST",
                                    },
                                })];
                        case 5:
                            _b.sent();
                            return [3, 8];
                        case 6: return [4, prisma.notification.update({
                                where: {
                                    id: notification.id,
                                },
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: session === null || session === void 0 ? void 0 : session.user.id,
                                        },
                                    },
                                    updatedAt: new Date(),
                                },
                            })];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8: return [2, {
                                success: true,
                                message: "Like post success",
                            }];
                    }
                });
            });
        },
        toggleLikeComment: function (_parent, _a, context) {
            var commentId = _a.commentId, postId = _a.postId, authorId = _a.authorId, isLiked = _a.isLiked;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, notification;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            if (!isLiked) return [3, 2];
                            return [4, prisma.comment.update({
                                    where: {
                                        id: commentId,
                                    },
                                    data: {
                                        likes: {
                                            disconnect: {
                                                id: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id,
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            _e.sent();
                            return [2, {
                                    success: true,
                                    message: "Unlike comment success",
                                }];
                        case 2: return [4, prisma.comment.update({
                                where: {
                                    id: commentId,
                                },
                                data: {
                                    likes: {
                                        connect: {
                                            id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id,
                                        },
                                    },
                                },
                            })];
                        case 3:
                            _e.sent();
                            if (!(authorId !== (session === null || session === void 0 ? void 0 : session.user.id))) return [3, 8];
                            return [4, prisma.notification.findFirst({
                                    where: {
                                        toUserId: authorId,
                                        type: "COMMENT_REPLY",
                                        postId: postId,
                                    },
                                })];
                        case 4:
                            notification = _e.sent();
                            if (!!notification) return [3, 6];
                            return [4, prisma.notification.create({
                                    data: {
                                        toUserId: authorId,
                                        type: "LIKE_POST",
                                        postId: postId,
                                        fromUsers: {
                                            connect: {
                                                id: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id,
                                            },
                                        },
                                    },
                                })];
                        case 5:
                            _e.sent();
                            return [3, 8];
                        case 6: return [4, prisma.notification.update({
                                where: {
                                    id: notification.id,
                                },
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: session === null || session === void 0 ? void 0 : session.user.id,
                                        },
                                    },
                                    updatedAt: new Date(),
                                },
                            })];
                        case 7:
                            _e.sent();
                            _e.label = 8;
                        case 8: return [2, {
                                success: true,
                                message: "Like comment success",
                            }];
                    }
                });
            });
        },
        followUser: function (_parent, _a, context) {
            var followingId = _a.followingId;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, follower, following, notification;
                var _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            return [4, prisma.user.update({
                                    where: { id: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id },
                                    data: { followings: { connect: [{ id: followingId }] } },
                                })];
                        case 1:
                            follower = _g.sent();
                            return [4, prisma.user.update({
                                    where: { id: followingId },
                                    data: { followers: { connect: [{ id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id }] } },
                                })];
                        case 2:
                            following = _g.sent();
                            return [4, prisma.notification.findFirst({
                                    where: {
                                        fromUsers: {
                                            some: {
                                                id: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id
                                            },
                                        },
                                        toUserId: followingId,
                                        type: "FOLLOW_USER"
                                    },
                                    select: {
                                        id: true
                                    }
                                })];
                        case 3:
                            notification = _g.sent();
                            if (!notification) return [3, 5];
                            return [4, prisma.notification.update({
                                    where: {
                                        id: notification.id
                                    },
                                    data: {
                                        fromUsers: {
                                            connect: {
                                                id: (_e = session === null || session === void 0 ? void 0 : session.user) === null || _e === void 0 ? void 0 : _e.id
                                            }
                                        },
                                        updatedAt: new Date()
                                    }
                                })];
                        case 4:
                            _g.sent();
                            return [3, 7];
                        case 5: return [4, prisma.notification.create({
                                data: {
                                    toUserId: followingId,
                                    fromUsers: {
                                        connect: {
                                            id: (_f = session === null || session === void 0 ? void 0 : session.user) === null || _f === void 0 ? void 0 : _f.id
                                        }
                                    },
                                    type: "FOLLOW_USER"
                                }
                            })];
                        case 6:
                            _g.sent();
                            _g.label = 7;
                        case 7: return [2, {
                                success: true,
                                message: "".concat(follower.name, " following ").concat(following.name),
                            }];
                    }
                });
            });
        },
        unFollowUser: function (_parent, _a, context) {
            var followingId = _a.followingId;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, follower, following;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            return [4, prisma.user.update({
                                    where: { id: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id },
                                    data: { followings: { disconnect: [{ id: followingId }] } },
                                })];
                        case 1:
                            follower = _d.sent();
                            return [4, prisma.user.update({
                                    where: { id: followingId },
                                    data: {
                                        followers: { disconnect: [{ id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id }] },
                                    },
                                })];
                        case 2:
                            following = _d.sent();
                            return [2, {
                                    success: true,
                                    message: "".concat(follower.name, " unFollow ").concat(following.name),
                                }];
                    }
                });
            });
        },
        createNotification: function (_parent, _a, context) {
            var notification = _a.notification;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            return [4, prisma.notification.create({
                                    data: {
                                        fromUsers: {
                                            connect: {
                                                id: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id,
                                            },
                                        },
                                        toUserId: notification.toUserId,
                                        type: notification.type,
                                        postId: notification.postId,
                                    },
                                })];
                        case 1:
                            _c.sent();
                            return [2, {
                                    success: true,
                                    message: "Create notification successfully",
                                }];
                    }
                });
            });
        },
        deleteNotification: function (_parent, _a, context) {
            var id = _a.id, userId = _a.userId;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, notification;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            if (!id) return [3, 2];
                            return [4, prisma.notification.delete({
                                    where: {
                                        id: id,
                                    },
                                })];
                        case 1:
                            _b.sent();
                            return [3, 5];
                        case 2: return [4, prisma.notification.findFirst({
                                where: {
                                    toUserId: userId,
                                    fromUsers: {
                                        every: {
                                            id: session === null || session === void 0 ? void 0 : session.user.id,
                                        },
                                    },
                                    type: "ADD_FRIEND"
                                },
                                select: {
                                    id: true,
                                },
                            })];
                        case 3:
                            notification = _b.sent();
                            return [4, prisma.notification.delete({
                                    where: {
                                        id: notification === null || notification === void 0 ? void 0 : notification.id,
                                    },
                                })];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [2, {
                                success: true,
                                message: "Delete notification successfully",
                            }];
                    }
                });
            });
        },
        createComment: function (_parent, _a, context) {
            var comment = _a.comment, authorId = _a.authorId;
            return __awaiter(void 0, void 0, void 0, function () {
                var prisma, session, parentId, content, file, postId, replyUserId, notification, notification, error_4;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return __generator(this, function (_m) {
                    switch (_m.label) {
                        case 0:
                            prisma = context.prisma, session = context.session;
                            parentId = comment.parentId, content = comment.content, file = comment.file, postId = comment.postId, replyUserId = comment.replyUserId;
                            _m.label = 1;
                        case 1:
                            _m.trys.push([1, 22, , 23]);
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            if (!replyUserId) return [3, 7];
                            if (!(authorId !== ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id))) return [3, 6];
                            return [4, prisma.notification.findFirst({
                                    where: {
                                        toUserId: replyUserId,
                                        type: "COMMENT_REPLY",
                                        postId: postId,
                                    },
                                    select: {
                                        id: true,
                                    },
                                })];
                        case 2:
                            notification = _m.sent();
                            if (!!notification) return [3, 4];
                            return [4, prisma.notification.create({
                                    data: {
                                        fromUsers: {
                                            connect: {
                                                id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id,
                                            },
                                        },
                                        toUserId: replyUserId,
                                        type: "COMMENT_REPLY",
                                        postId: postId,
                                    },
                                })];
                        case 3:
                            _m.sent();
                            return [3, 6];
                        case 4: return [4, prisma.notification.update({
                                where: {
                                    id: notification.id,
                                },
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id,
                                        }
                                    },
                                    updatedAt: new Date(),
                                },
                            })];
                        case 5:
                            _m.sent();
                            _m.label = 6;
                        case 6: return [3, 12];
                        case 7:
                            if (!(authorId !== ((_e = session === null || session === void 0 ? void 0 : session.user) === null || _e === void 0 ? void 0 : _e.id))) return [3, 12];
                            return [4, prisma.notification.findFirst({
                                    where: {
                                        postId: postId,
                                        type: "COMMENT_POST",
                                        toUserId: authorId
                                    },
                                    select: {
                                        id: true
                                    }
                                })];
                        case 8:
                            notification = _m.sent();
                            if (!notification) return [3, 10];
                            return [4, prisma.notification.update({
                                    where: {
                                        id: notification.id
                                    },
                                    data: {
                                        fromUsers: {
                                            connect: {
                                                id: (_f = session === null || session === void 0 ? void 0 : session.user) === null || _f === void 0 ? void 0 : _f.id
                                            }
                                        },
                                        updatedAt: new Date()
                                    }
                                })];
                        case 9:
                            _m.sent();
                            return [3, 12];
                        case 10: return [4, prisma.notification.create({
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: (_g = session === null || session === void 0 ? void 0 : session.user) === null || _g === void 0 ? void 0 : _g.id
                                        }
                                    },
                                    toUserId: authorId,
                                    type: "COMMENT_POST",
                                    postId: postId
                                }
                            })];
                        case 11:
                            _m.sent();
                            _m.label = 12;
                        case 12:
                            if (!parentId) return [3, 17];
                            if (!file) return [3, 14];
                            return [4, prisma.comment.create({
                                    data: {
                                        content: content,
                                        postId: postId,
                                        userId: (_h = session === null || session === void 0 ? void 0 : session.user) === null || _h === void 0 ? void 0 : _h.id,
                                        replyUserId: replyUserId,
                                        commentOf: {
                                            connect: {
                                                id: parentId,
                                            },
                                        },
                                        file: {
                                            create: {
                                                publicId: file.publicId,
                                                type: file.type,
                                                url: file.url,
                                            },
                                        },
                                    },
                                })];
                        case 13:
                            _m.sent();
                            return [2, {
                                    success: true,
                                    message: "Create comment success",
                                }];
                        case 14: return [4, prisma.comment.create({
                                data: {
                                    content: content,
                                    postId: postId,
                                    userId: (_j = session === null || session === void 0 ? void 0 : session.user) === null || _j === void 0 ? void 0 : _j.id,
                                    replyUserId: replyUserId,
                                    commentOf: {
                                        connect: {
                                            id: parentId,
                                        },
                                    },
                                },
                            })];
                        case 15:
                            _m.sent();
                            return [2, {
                                    success: true,
                                    message: "Create comment success",
                                }];
                        case 16: return [3, 21];
                        case 17:
                            if (!file) return [3, 19];
                            return [4, prisma.comment.create({
                                    data: {
                                        content: content,
                                        postId: postId,
                                        userId: (_k = session === null || session === void 0 ? void 0 : session.user) === null || _k === void 0 ? void 0 : _k.id,
                                        file: {
                                            create: {
                                                publicId: file.publicId,
                                                type: file.type,
                                                url: file.url,
                                            },
                                        },
                                    },
                                })];
                        case 18:
                            _m.sent();
                            return [2, {
                                    success: true,
                                    message: "Create comment success",
                                }];
                        case 19: return [4, prisma.comment.create({
                                data: {
                                    content: content,
                                    postId: postId,
                                    userId: (_l = session === null || session === void 0 ? void 0 : session.user) === null || _l === void 0 ? void 0 : _l.id,
                                },
                            })];
                        case 20:
                            _m.sent();
                            return [2, {
                                    success: true,
                                    message: "Create comment success",
                                }];
                        case 21: return [3, 23];
                        case 22:
                            error_4 = _m.sent();
                            return [2, {
                                    success: false,
                                    message: error_4.message,
                                }];
                        case 23: return [2];
                    }
                });
            });
        },
        deleteComment: function (_parent, _a) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, prisma.comment.delete({
                                where: {
                                    id: id,
                                },
                            })];
                        case 1:
                            _b.sent();
                            return [2, {
                                    success: true,
                                    message: "Comment deleted success",
                                }];
                    }
                });
            });
        },
        sendMessage: function (_, args, context) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function () {
                var session, prisma, message, conversationId, content, files, toUserId, message_1, message_2, conversationCreated, conversations, conversation, error_5;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            session = context.session, prisma = context.prisma;
                            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                                throw new graphql_1.GraphQLError("Not authorized");
                            }
                            message = args.message;
                            conversationId = message.conversationId, content = message.content, files = message.files, toUserId = message.toUserId;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 11, , 12]);
                            if (!conversationId) return [3, 6];
                            if (!files) return [3, 3];
                            return [4, prisma.message.create({
                                    data: {
                                        content: content,
                                        conversationId: conversationId,
                                        senderId: (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id,
                                        files: {
                                            createMany: {
                                                data: files
                                            }
                                        }
                                    }
                                })];
                        case 2:
                            message_1 = _e.sent();
                            return [2, message_1];
                        case 3: return [4, prisma.message.create({
                                data: {
                                    content: content,
                                    conversationId: conversationId,
                                    senderId: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id,
                                }
                            })];
                        case 4:
                            message_2 = _e.sent();
                            return [2, message_2];
                        case 5: return [3, 10];
                        case 6: return [4, prisma.conversation.create({
                                data: {
                                    participants: {
                                        connect: [{ id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id }, { id: toUserId }]
                                    },
                                }
                            })];
                        case 7:
                            conversationCreated = _e.sent();
                            return [4, prisma.message.create({
                                    data: {
                                        content: content,
                                        conversationId: conversationCreated.id,
                                        senderId: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id,
                                    }
                                })];
                        case 8:
                            _e.sent();
                            return [4, prisma.conversation.findMany({
                                    include: {
                                        messages: {
                                            select: {
                                                content: true,
                                                sender: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        image: true
                                                    },
                                                },
                                                files: {
                                                    select: {
                                                        publicId: true,
                                                        type: true,
                                                        url: true
                                                    }
                                                }
                                            }
                                        },
                                        participants: {
                                            select: {
                                                id: true
                                            }
                                        }
                                    }
                                })];
                        case 9:
                            conversations = _e.sent();
                            conversation = conversations.find(function (conversation) { return conversation.participants.some(function (p) { var _a; return p.id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id) && p.id === toUserId; }); });
                            return [2, conversation];
                        case 10: return [3, 12];
                        case 11:
                            error_5 = _e.sent();
                            throw new graphql_1.GraphQLError("Error sending message");
                        case 12: return [2];
                    }
                });
            });
        },
    },
};
exports.default = resolvers;
