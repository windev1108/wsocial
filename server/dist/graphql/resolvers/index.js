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
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const prisma = new client_1.PrismaClient();
const resolvers = {
    Query: {
        // Query all users
        getUsers: () => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.user.findMany(); }),
        // Query user by Id
        getUserById: (_parent, { id }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { prisma, session } = context;
            const user = yield prisma.user.findUnique({
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
            });
            return Object.assign(Object.assign({}, user), { isMySelf: id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id), isFriend: user === null || user === void 0 ? void 0 : user.friends.some((user) => { var _a; return user.id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id); }), isSendAddFriend: user === null || user === void 0 ? void 0 : user.notificationsTo.some((notification) => notification.toUserId === id &&
                    notification.fromUsers.some((user) => { var _a; return user.id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id); }) &&
                    notification.type === "ADD_FRIEND"), isReceiveAddFriend: user === null || user === void 0 ? void 0 : user.notificationsFrom.some((notification) => {
                    var _a;
                    return notification.toUserId === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id) &&
                        notification.fromUsers.some((user) => user.id === id) &&
                        notification.type === "ADD_FRIEND";
                }), isFollowing: user === null || user === void 0 ? void 0 : user.followers.some((user) => { var _a; return user.id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id); }), _count: {
                    followers: user === null || user === void 0 ? void 0 : user._count.followers,
                    followings: user === null || user === void 0 ? void 0 : user._count.followings,
                } });
        }),
        // Query all post
        getPosts: (_parent, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
            const { friends, followings } = yield prisma.user.findUnique({
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
            });
            const posts = yield prisma.post.findMany({
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
            });
            const customPosts = posts
                .filter((post) => friends.some((u) => u.id === post.authorId) ||
                followings.some((u) => u.id === post.authorId) ||
                (post.authorId === userId && post.viewer === "PRIVATE") ||
                userId === post.authorId)
                .map((post) => {
                return Object.assign(Object.assign({}, post), { isMySelf: post.authorId !== userId && post.viewer === "PRIVATE" });
            });
            return customPosts.filter((post) => !post.isMySelf);
        }),
        //  Query post by Id
        getPostById: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.post.findUnique({
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
            });
        }),
        findConversation: (_, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { session, prisma } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            try {
                const { id } = session.user;
                const { userId } = _args;
                /**
                 * Find all conversations that user is part of
                 */
                const conversations = yield prisma.conversation.findMany({
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
                });
                return conversations.find((conversation) => conversation.participants.some((p) => p.id === id) && conversation.participants.some((p) => p.id === userId));
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error === null || error === void 0 ? void 0 : error.message);
            }
        }),
        conversations: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            try {
                const { prisma, session } = context;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError("Not authorized");
                }
                const conversations = yield prisma.conversation.findMany({
                    where: {
                        participants: {
                            some: {
                                id: {
                                    equals: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id
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
                });
                return conversations.map((conversation) => {
                    return Object.assign(Object.assign({}, conversation), { latestMessage: conversation.messages[0], _count: {
                            messages: conversation.messages.filter((message) => { var _a; return (message === null || message === void 0 ? void 0 : message.senderId) !== ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id); }).length
                        }, user: conversation.participants.filter((user) => { var _a; return (user === null || user === void 0 ? void 0 : user.id) !== ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id); })[0] });
                });
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message);
            }
        })
    },
    //  Query the children  of user
    User: {
        posts: (_parent, { isMySelf, isFriend }) => __awaiter(void 0, void 0, void 0, function* () {
            if (isMySelf) {
                const posts = yield prisma.post.findMany({
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
                });
                return posts;
            }
            else if (isFriend) {
                const posts = yield prisma.post.findMany({
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
                });
                return posts;
            }
            else {
                const posts = yield prisma.post.findMany({
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
                });
                return posts;
            }
        }),
        friends: (_parent, _args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { id: _parent.id },
                select: { friends: true },
            });
            return user === null || user === void 0 ? void 0 : user.friends;
        }),
        notFriends: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            const { prisma, session } = context;
            const users = yield prisma.user.findMany({
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
            });
            const userSession = yield prisma.user.findFirst({
                where: {
                    id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id,
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
            });
            return users.map((user) => {
                return Object.assign(Object.assign({}, user), { isSendAddFriend: userSession === null || userSession === void 0 ? void 0 : userSession.notificationsFrom.some((notification) => notification.type === "ADD_FRIEND" && notification.toUserId === user.id), isReceiveAddFriend: userSession === null || userSession === void 0 ? void 0 : userSession.notificationsTo.some((notification) => notification.toUserId === _parent.id &&
                        notification.fromUsers.some((u) => u.id === user.id) &&
                        notification.type === "ADD_FRIEND") });
            });
        }),
        followers: (_parent, _args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { id: _parent.id },
                select: { followers: true },
            });
            return user === null || user === void 0 ? void 0 : user.followers;
        }),
        followings: (_parent, _args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { id: _parent.id },
                select: { followings: true },
            });
            return user === null || user === void 0 ? void 0 : user.followings;
        }),
        notificationsFrom: (_parent, _args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
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
            });
            return user === null || user === void 0 ? void 0 : user.notificationsFrom;
        }),
        notificationsTo: (_parent, _args) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
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
            });
            return user === null || user === void 0 ? void 0 : user.notificationsTo;
        }),
    },
    // Query the children  of post
    Post: {
        author: (_parent, _args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.user.findUnique({
                where: {
                    id: _parent.authorId,
                },
            });
        }),
        likes: (_parent, _args) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield prisma.post.findUnique({
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
            });
            return post === null || post === void 0 ? void 0 : post.likes;
        }),
        files: (_parent, _args) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma.file.findMany({
                where: {
                    postId: _parent.id,
                },
            });
        }),
        comments: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const post = yield prisma.post.findUnique({
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
            });
            return post === null || post === void 0 ? void 0 : post.comments.filter((comment) => comment.commentOf.length === 0);
        }),
        postSharedOf: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { prisma } = context;
            const post = yield prisma.post.findUnique({
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
            });
            return post === null || post === void 0 ? void 0 : post.postSharedOf[0];
        }),
    },
    Mutation: {
        addFriendship: (_parent, { userIdB }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _d, _e, _f, _g, _h;
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const userASuccess = yield prisma.user.update({
                where: { id: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id },
                data: { friends: { connect: [{ id: userIdB }] } },
            });
            const userBSuccess = yield prisma.user.update({
                where: { id: userIdB },
                data: { friends: { connect: [{ id: (_e = session === null || session === void 0 ? void 0 : session.user) === null || _e === void 0 ? void 0 : _e.id }] } },
            });
            yield prisma.user.update({
                where: { id: (_f = session === null || session === void 0 ? void 0 : session.user) === null || _f === void 0 ? void 0 : _f.id },
                data: { followings: { connect: [{ id: userIdB }] } },
            });
            yield prisma.user.update({
                where: { id: (_g = session === null || session === void 0 ? void 0 : session.user) === null || _g === void 0 ? void 0 : _g.id },
                data: { followers: { connect: [{ id: userIdB }] } },
            });
            const notification = yield prisma.notification.findFirst({
                where: {
                    toUserId: (_h = session === null || session === void 0 ? void 0 : session.user) === null || _h === void 0 ? void 0 : _h.id,
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
            });
            yield prisma.notification.delete({
                where: {
                    id: notification === null || notification === void 0 ? void 0 : notification.id,
                },
            });
            return {
                success: true,
                message: `${userASuccess.name} and  ${userBSuccess.name} have become friends`,
            };
        }),
        removeFriendship: (_parent, { userIdB }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k, _l, _m;
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const userASuccess = yield prisma.user.update({
                where: { id: (_j = session === null || session === void 0 ? void 0 : session.user) === null || _j === void 0 ? void 0 : _j.id },
                data: { friends: { disconnect: [{ id: userIdB }] } },
            });
            const userBSuccess = yield prisma.user.update({
                where: { id: userIdB },
                data: {
                    friends: { disconnect: [{ id: (_k = session === null || session === void 0 ? void 0 : session.user) === null || _k === void 0 ? void 0 : _k.id }] },
                },
            });
            yield prisma.user.update({
                where: { id: (_l = session === null || session === void 0 ? void 0 : session.user) === null || _l === void 0 ? void 0 : _l.id },
                data: { followings: { disconnect: [{ id: userIdB }] } },
            });
            yield prisma.user.update({
                where: { id: (_m = session === null || session === void 0 ? void 0 : session.user) === null || _m === void 0 ? void 0 : _m.id },
                data: { followers: { disconnect: [{ id: userIdB }] } },
            });
            return {
                success: true,
                message: `${userASuccess.name} and  ${userBSuccess.name} have become strangers`,
            };
        }),
        createPost: (_parent, { post }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _o, _p, _q, _r, _s;
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (post.files) {
                yield prisma.post.create({
                    data: Object.assign(Object.assign({}, post), { authorId: (_o = session === null || session === void 0 ? void 0 : session.user) === null || _o === void 0 ? void 0 : _o.id, files: {
                            createMany: {
                                data: post.files,
                            },
                        } }),
                    include: {
                        files: true,
                    },
                });
            }
            else {
                if (post.postIdShared) {
                    const postShared = yield prisma.post.create({
                        data: {
                            content: post.content,
                            viewer: post.viewer,
                            authorId: (_p = session === null || session === void 0 ? void 0 : session.user) === null || _p === void 0 ? void 0 : _p.id,
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
                    });
                    yield prisma.post.update({
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
                    });
                    if (postShared.authorId !== (session === null || session === void 0 ? void 0 : session.user.id)) {
                        const notification = yield prisma.notification.findFirst({
                            where: {
                                fromUsers: {
                                    some: {
                                        id: (_q = session === null || session === void 0 ? void 0 : session.user) === null || _q === void 0 ? void 0 : _q.id,
                                    },
                                },
                                toUserId: postShared.postSharedOf[0].authorId,
                                postId: post.postIdShared,
                                type: "SHARE_POST",
                            },
                            select: {
                                id: true,
                            },
                        });
                        if (notification) {
                            yield prisma.notification.update({
                                where: {
                                    id: notification.id,
                                },
                                data: {
                                    updatedAt: new Date(),
                                },
                            });
                        }
                        else {
                            yield prisma.notification.create({
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: (_r = session === null || session === void 0 ? void 0 : session.user) === null || _r === void 0 ? void 0 : _r.id,
                                        },
                                    },
                                    toUserId: postShared.postSharedOf[0].authorId,
                                    postId: post.postIdShared,
                                    type: "SHARE_POST",
                                },
                            });
                        }
                    }
                    return {
                        success: true,
                        message: "Share post success",
                    };
                }
                else {
                    yield prisma.post.create({
                        data: Object.assign(Object.assign({}, post), { authorId: (_s = session === null || session === void 0 ? void 0 : session.user) === null || _s === void 0 ? void 0 : _s.id }),
                    });
                    return {
                        success: true,
                        message: "Created post successfully",
                    };
                }
            }
        }),
        updatePost: (_parent, { id, post }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (post.files) {
                yield prisma.post.update({
                    where: {
                        id,
                    },
                    data: Object.assign(Object.assign({}, post), { files: {
                            deleteMany: {},
                            createMany: {
                                data: post.files,
                            },
                        } }),
                    include: {
                        files: true,
                    },
                });
            }
            else {
                yield prisma.post.update({
                    where: {
                        id,
                    },
                    data: Object.assign(Object.assign({}, post), { files: {
                            deleteMany: {},
                        } }),
                    include: {
                        files: true,
                    },
                });
            }
            return {
                success: true,
                message: "Updated post successfully",
            };
        }),
        deletePost: (_parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.post.delete({
                where: {
                    id,
                },
            });
            return {
                success: true,
                message: "Deleted post successfully",
            };
        }),
        // Users
        updateUser: (_parent, { user }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _t;
            try {
                const { session } = context;
                const userUpdate = yield prisma.user.update({
                    where: {
                        id: (_t = session === null || session === void 0 ? void 0 : session.user) === null || _t === void 0 ? void 0 : _t.id,
                    },
                    data: user,
                });
                if (userUpdate) {
                    return {
                        success: true,
                        message: "Updated user successfully",
                    };
                }
                else {
                    return {
                        success: false,
                        message: "Updated user failed",
                    };
                }
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        }),
        // Likes
        toggleLikePost: (_parent, { postId, authorId, isLiked, }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { session, prisma } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (isLiked) {
                yield prisma.post.update({
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
                });
                return {
                    success: true,
                    message: "Unlike post success",
                };
            }
            else {
                yield prisma.post.update({
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
                });
                if (authorId !== (session === null || session === void 0 ? void 0 : session.user.id)) {
                    const notification = yield prisma.notification.findFirst({
                        where: {
                            toUserId: authorId,
                            postId,
                            type: "LIKE_POST",
                        },
                    });
                    if (!notification) {
                        yield prisma.notification.create({
                            data: {
                                fromUsers: {
                                    connect: {
                                        id: session === null || session === void 0 ? void 0 : session.user.id,
                                    },
                                },
                                toUserId: authorId,
                                postId,
                                type: "LIKE_POST",
                            },
                        });
                    }
                    else {
                        yield prisma.notification.update({
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
                        });
                    }
                }
                return {
                    success: true,
                    message: "Like post success",
                };
            }
        }),
        toggleLikeComment: (_parent, { commentId, postId, authorId, isLiked, }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _u, _v, _w;
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (isLiked) {
                yield prisma.comment.update({
                    where: {
                        id: commentId,
                    },
                    data: {
                        likes: {
                            disconnect: {
                                id: (_u = session === null || session === void 0 ? void 0 : session.user) === null || _u === void 0 ? void 0 : _u.id,
                            },
                        },
                    },
                });
                return {
                    success: true,
                    message: "Unlike comment success",
                };
            }
            else {
                yield prisma.comment.update({
                    where: {
                        id: commentId,
                    },
                    data: {
                        likes: {
                            connect: {
                                id: (_v = session === null || session === void 0 ? void 0 : session.user) === null || _v === void 0 ? void 0 : _v.id,
                            },
                        },
                    },
                });
                if (authorId !== (session === null || session === void 0 ? void 0 : session.user.id)) {
                    const notification = yield prisma.notification.findFirst({
                        where: {
                            toUserId: authorId,
                            type: "COMMENT_REPLY",
                            postId,
                        },
                    });
                    if (!notification) {
                        yield prisma.notification.create({
                            data: {
                                toUserId: authorId,
                                type: "LIKE_POST",
                                postId,
                                fromUsers: {
                                    connect: {
                                        id: (_w = session === null || session === void 0 ? void 0 : session.user) === null || _w === void 0 ? void 0 : _w.id,
                                    },
                                },
                            },
                        });
                    }
                    else {
                        yield prisma.notification.update({
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
                        });
                    }
                }
                return {
                    success: true,
                    message: "Like comment success",
                };
            }
        }),
        // follows
        followUser: (_parent, { followingId, }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _x, _y, _z, _0, _1;
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const follower = yield prisma.user.update({
                where: { id: (_x = session === null || session === void 0 ? void 0 : session.user) === null || _x === void 0 ? void 0 : _x.id },
                data: { followings: { connect: [{ id: followingId }] } },
            });
            const following = yield prisma.user.update({
                where: { id: followingId },
                data: { followers: { connect: [{ id: (_y = session === null || session === void 0 ? void 0 : session.user) === null || _y === void 0 ? void 0 : _y.id }] } },
            });
            const notification = yield prisma.notification.findFirst({
                where: {
                    fromUsers: {
                        some: {
                            id: (_z = session === null || session === void 0 ? void 0 : session.user) === null || _z === void 0 ? void 0 : _z.id
                        },
                    },
                    toUserId: followingId,
                    type: "FOLLOW_USER"
                },
                select: {
                    id: true
                }
            });
            if (notification) {
                yield prisma.notification.update({
                    where: {
                        id: notification.id
                    },
                    data: {
                        fromUsers: {
                            connect: {
                                id: (_0 = session === null || session === void 0 ? void 0 : session.user) === null || _0 === void 0 ? void 0 : _0.id
                            }
                        },
                        updatedAt: new Date()
                    }
                });
            }
            else {
                yield prisma.notification.create({
                    data: {
                        toUserId: followingId,
                        fromUsers: {
                            connect: {
                                id: (_1 = session === null || session === void 0 ? void 0 : session.user) === null || _1 === void 0 ? void 0 : _1.id
                            }
                        },
                        type: "FOLLOW_USER"
                    }
                });
            }
            return {
                success: true,
                message: `${follower.name} following ${following.name}`,
            };
        }),
        unFollowUser: (_parent, { followingId }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _2, _3;
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const follower = yield prisma.user.update({
                where: { id: (_2 = session === null || session === void 0 ? void 0 : session.user) === null || _2 === void 0 ? void 0 : _2.id },
                data: { followings: { disconnect: [{ id: followingId }] } },
            });
            const following = yield prisma.user.update({
                where: { id: followingId },
                data: {
                    followers: { disconnect: [{ id: (_3 = session === null || session === void 0 ? void 0 : session.user) === null || _3 === void 0 ? void 0 : _3.id }] },
                },
            });
            return {
                success: true,
                message: `${follower.name} unFollow ${following.name}`,
            };
        }),
        // notifications
        createNotification: (_parent, { notification }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _4;
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            yield prisma.notification.create({
                data: {
                    fromUsers: {
                        connect: {
                            id: (_4 = session === null || session === void 0 ? void 0 : session.user) === null || _4 === void 0 ? void 0 : _4.id,
                        },
                    },
                    toUserId: notification.toUserId,
                    type: notification.type,
                    postId: notification.postId,
                },
            });
            return {
                success: true,
                message: "Create notification successfully",
            };
        }),
        deleteNotification: (_parent, { id, userId }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { prisma, session } = context;
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (id) {
                yield prisma.notification.delete({
                    where: {
                        id,
                    },
                });
            }
            else {
                const notification = yield prisma.notification.findFirst({
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
                });
                yield prisma.notification.delete({
                    where: {
                        id: notification === null || notification === void 0 ? void 0 : notification.id,
                    },
                });
            }
            return {
                success: true,
                message: "Delete notification successfully",
            };
        }),
        // Comments
        createComment: (_parent, { comment, authorId }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
            const { prisma, session } = context;
            const { parentId, content, file, postId, replyUserId } = comment;
            try {
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError("Not authorized");
                }
                //  create notification reply user
                if (replyUserId) {
                    if (authorId !== ((_5 = session === null || session === void 0 ? void 0 : session.user) === null || _5 === void 0 ? void 0 : _5.id)) {
                        const notification = yield prisma.notification.findFirst({
                            where: {
                                toUserId: replyUserId,
                                type: "COMMENT_REPLY",
                                postId,
                            },
                            select: {
                                id: true,
                            },
                        });
                        if (!notification) {
                            yield prisma.notification.create({
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: (_6 = session === null || session === void 0 ? void 0 : session.user) === null || _6 === void 0 ? void 0 : _6.id,
                                        },
                                    },
                                    toUserId: replyUserId,
                                    type: "COMMENT_REPLY",
                                    postId,
                                },
                            });
                        }
                        else {
                            yield prisma.notification.update({
                                where: {
                                    id: notification.id,
                                },
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: (_7 = session === null || session === void 0 ? void 0 : session.user) === null || _7 === void 0 ? void 0 : _7.id,
                                        }
                                    },
                                    updatedAt: new Date(),
                                },
                            });
                        }
                    }
                }
                else {
                    if (authorId !== ((_8 = session === null || session === void 0 ? void 0 : session.user) === null || _8 === void 0 ? void 0 : _8.id)) {
                        const notification = yield prisma.notification.findFirst({
                            where: {
                                postId,
                                type: "COMMENT_POST",
                                toUserId: authorId
                            },
                            select: {
                                id: true
                            }
                        });
                        if (notification) {
                            yield prisma.notification.update({
                                where: {
                                    id: notification.id
                                },
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: (_9 = session === null || session === void 0 ? void 0 : session.user) === null || _9 === void 0 ? void 0 : _9.id
                                        }
                                    },
                                    updatedAt: new Date()
                                }
                            });
                        }
                        else {
                            yield prisma.notification.create({
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: (_10 = session === null || session === void 0 ? void 0 : session.user) === null || _10 === void 0 ? void 0 : _10.id
                                        }
                                    },
                                    toUserId: authorId,
                                    type: "COMMENT_POST",
                                    postId
                                }
                            });
                        }
                    }
                }
                if (parentId) {
                    if (file) {
                        yield prisma.comment.create({
                            data: {
                                content,
                                postId,
                                userId: (_11 = session === null || session === void 0 ? void 0 : session.user) === null || _11 === void 0 ? void 0 : _11.id,
                                replyUserId,
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
                        });
                        return {
                            success: true,
                            message: "Create comment success",
                        };
                    }
                    else {
                        yield prisma.comment.create({
                            data: {
                                content,
                                postId,
                                userId: (_12 = session === null || session === void 0 ? void 0 : session.user) === null || _12 === void 0 ? void 0 : _12.id,
                                replyUserId,
                                commentOf: {
                                    connect: {
                                        id: parentId,
                                    },
                                },
                            },
                        });
                        return {
                            success: true,
                            message: "Create comment success",
                        };
                    }
                }
                else {
                    if (file) {
                        yield prisma.comment.create({
                            data: {
                                content,
                                postId,
                                userId: (_13 = session === null || session === void 0 ? void 0 : session.user) === null || _13 === void 0 ? void 0 : _13.id,
                                file: {
                                    create: {
                                        publicId: file.publicId,
                                        type: file.type,
                                        url: file.url,
                                    },
                                },
                            },
                        });
                        return {
                            success: true,
                            message: "Create comment success",
                        };
                    }
                    else {
                        yield prisma.comment.create({
                            data: {
                                content,
                                postId,
                                userId: (_14 = session === null || session === void 0 ? void 0 : session.user) === null || _14 === void 0 ? void 0 : _14.id,
                            },
                        });
                        return {
                            success: true,
                            message: "Create comment success",
                        };
                    }
                }
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        }),
        deleteComment: (_parent, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.comment.delete({
                where: {
                    id,
                },
            });
            return {
                success: true,
                message: "Comment deleted success",
            };
        }),
        // message
        sendMessage: function (_, args, context) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function* () {
                const { session, prisma } = context;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError("Not authorized");
                }
                const { message } = args;
                const { conversationId, content, files, toUserId } = message;
                try {
                    if (conversationId) {
                        if (files) {
                            const message = yield prisma.message.create({
                                data: {
                                    content,
                                    conversationId,
                                    senderId: (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id,
                                    files: {
                                        createMany: {
                                            data: files
                                        }
                                    }
                                }
                            });
                            return message;
                        }
                        else {
                            const message = yield prisma.message.create({
                                data: {
                                    content,
                                    conversationId,
                                    senderId: (_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.id,
                                }
                            });
                            return message;
                        }
                    }
                    else {
                        const conversationCreated = yield prisma.conversation.create({
                            data: {
                                participants: {
                                    connect: [{ id: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.id }, { id: toUserId }]
                                },
                            }
                        });
                        yield prisma.message.create({
                            data: {
                                content,
                                conversationId: conversationCreated.id,
                                senderId: (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.id,
                            }
                        });
                        const conversations = yield prisma.conversation.findMany({
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
                        });
                        const conversation = conversations.find((conversation) => conversation.participants.some((p) => { var _a; return p.id === ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id) && p.id === toUserId; }));
                        return conversation;
                    }
                }
                catch (error) {
                    throw new graphql_1.GraphQLError("Error sending message");
                }
            });
        },
    },
};
exports.default = resolvers;
//# sourceMappingURL=index.js.map