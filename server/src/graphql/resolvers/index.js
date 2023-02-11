"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const prisma = new client_1.PrismaClient();
const resolvers = {
    Query: {
        // Query all users
        getUsers: async () => await prisma.user.findMany(),
        // Query user by Id
        getUserById: async (_parent, { id }, context) => {
            const { prisma, session } = context;
            const user = await prisma.user.findUnique({
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
            return {
                ...user,
                isMySelf: id === session?.user?.id,
                isFriend: user?.friends.some((user) => user.id === session?.user?.id),
                isSendAddFriend: user?.notificationsTo.some((notification) => notification.toUserId === id &&
                    notification.fromUsers.some((user) => user.id === session?.user?.id) &&
                    notification.type === "ADD_FRIEND"),
                isReceiveAddFriend: user?.notificationsFrom.some((notification) => notification.toUserId === session?.user?.id &&
                    notification.fromUsers.some((user) => user.id === id) &&
                    notification.type === "ADD_FRIEND"),
                isFollowing: user?.followers.some((user) => user.id === session?.user?.id),
                _count: {
                    followers: user?._count.followers,
                    followings: user?._count.followings,
                }
            };
        },
        // Query all post
        getPosts: async (_parent, { userId }) => {
            const { friends, followings } = await prisma.user.findUnique({
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
            const posts = await prisma.post.findMany({
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
                return {
                    ...post,
                    isMySelf: post.authorId !== userId && post.viewer === "PRIVATE",
                };
            });
            return customPosts.filter((post) => !post.isMySelf);
        },
        //  Query post by Id
        getPostById: async (_parent, args) => await prisma.post.findUnique({
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
        }),
        findConversation: async (_, _args, context) => {
            const { session, prisma } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            try {
                const { id } = session.user;
                const { userId } = _args;
                /**
                 * Find all conversations that user is part of
                 */
                const conversations = await prisma.conversation.findMany({
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
                throw new graphql_1.GraphQLError(error?.message);
            }
        },
        conversations: async (_parent, _args, context) => {
            try {
                const { prisma, session } = context;
                if (!session?.user) {
                    throw new graphql_1.GraphQLError("Not authorized");
                }
                const conversations = await prisma.conversation.findMany({
                    where: {
                        participants: {
                            some: {
                                id: {
                                    equals: session?.user?.id
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
                    return {
                        ...conversation,
                        latestMessage: conversation.messages[0],
                        _count: {
                            messages: conversation.messages.filter((message) => message?.senderId !== session?.user?.id).length
                        },
                        user: conversation.participants.filter((user) => user?.id !== session?.user?.id)[0]
                    };
                });
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message);
            }
        }
    },
    //  Query the children  of user
    User: {
        posts: async (_parent, { isMySelf, isFriend }) => {
            if (isMySelf) {
                const posts = await prisma.post.findMany({
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
                const posts = await prisma.post.findMany({
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
                const posts = await prisma.post.findMany({
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
        },
        friends: async (_parent, _args) => {
            const user = await prisma.user.findUnique({
                where: { id: _parent.id },
                select: { friends: true },
            });
            return user?.friends;
        },
        notFriends: async (_parent, _args, context) => {
            const { prisma, session } = context;
            const users = await prisma.user.findMany({
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
            const userSession = await prisma.user.findFirst({
                where: {
                    id: session?.user?.id,
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
                return {
                    ...user,
                    isSendAddFriend: userSession?.notificationsFrom.some((notification) => notification.type === "ADD_FRIEND" && notification.toUserId === user.id),
                    isReceiveAddFriend: userSession?.notificationsTo.some((notification) => notification.toUserId === _parent.id &&
                        notification.fromUsers.some((u) => u.id === user.id) &&
                        notification.type === "ADD_FRIEND"),
                };
            });
        },
        followers: async (_parent, _args) => {
            const user = await prisma.user.findUnique({
                where: { id: _parent.id },
                select: { followers: true },
            });
            return user?.followers;
        },
        followings: async (_parent, _args) => {
            const user = await prisma.user.findUnique({
                where: { id: _parent.id },
                select: { followings: true },
            });
            return user?.followings;
        },
        notificationsFrom: async (_parent, _args) => {
            const user = await prisma.user.findUnique({
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
            return user?.notificationsFrom;
        },
        notificationsTo: async (_parent, _args) => {
            const user = await prisma.user.findUnique({
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
            return user?.notificationsTo;
        },
    },
    // Query the children  of post
    Post: {
        author: async (_parent, _args) => await prisma.user.findUnique({
            where: {
                id: _parent.authorId,
            },
        }),
        likes: async (_parent, _args) => {
            const post = await prisma.post.findUnique({
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
            return post?.likes;
        },
        files: async (_parent, _args) => await prisma.file.findMany({
            where: {
                postId: _parent.id,
            },
        }),
        comments: async (_parent, _args, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const post = await prisma.post.findUnique({
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
            return post?.comments.filter((comment) => comment.commentOf.length === 0);
        },
        postSharedOf: async (_parent, _args, context) => {
            const { prisma } = context;
            const post = await prisma.post.findUnique({
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
            return post?.postSharedOf[0];
        },
    },
    Mutation: {
        addFriendship: async (_parent, { userIdB }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const userASuccess = await prisma.user.update({
                where: { id: session?.user?.id },
                data: { friends: { connect: [{ id: userIdB }] } },
            });
            const userBSuccess = await prisma.user.update({
                where: { id: userIdB },
                data: { friends: { connect: [{ id: session?.user?.id }] } },
            });
            await prisma.user.update({
                where: { id: session?.user?.id },
                data: { followings: { connect: [{ id: userIdB }] } },
            });
            await prisma.user.update({
                where: { id: session?.user?.id },
                data: { followers: { connect: [{ id: userIdB }] } },
            });
            const notification = await prisma.notification.findFirst({
                where: {
                    toUserId: session?.user?.id,
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
            await prisma.notification.delete({
                where: {
                    id: notification?.id,
                },
            });
            return {
                success: true,
                message: `${userASuccess.name} and  ${userBSuccess.name} have become friends`,
            };
        },
        removeFriendship: async (_parent, { userIdB }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const userASuccess = await prisma.user.update({
                where: { id: session?.user?.id },
                data: { friends: { disconnect: [{ id: userIdB }] } },
            });
            const userBSuccess = await prisma.user.update({
                where: { id: userIdB },
                data: {
                    friends: { disconnect: [{ id: session?.user?.id }] },
                },
            });
            await prisma.user.update({
                where: { id: session?.user?.id },
                data: { followings: { disconnect: [{ id: userIdB }] } },
            });
            await prisma.user.update({
                where: { id: session?.user?.id },
                data: { followers: { disconnect: [{ id: userIdB }] } },
            });
            return {
                success: true,
                message: `${userASuccess.name} and  ${userBSuccess.name} have become strangers`,
            };
        },
        createPost: async (_parent, { post }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (post.files) {
                await prisma.post.create({
                    data: {
                        ...post,
                        authorId: session?.user?.id,
                        files: {
                            createMany: {
                                data: post.files,
                            },
                        },
                    },
                    include: {
                        files: true,
                    },
                });
            }
            else {
                if (post.postIdShared) {
                    const postShared = await prisma.post.create({
                        data: {
                            content: post.content,
                            viewer: post.viewer,
                            authorId: session?.user?.id,
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
                    await prisma.post.update({
                        where: {
                            id: post.postIdShared,
                        },
                        data: {
                            postShared: {
                                connect: {
                                    id: postShared?.id,
                                },
                            },
                        },
                    });
                    if (postShared.authorId !== session?.user.id) {
                        const notification = await prisma.notification.findFirst({
                            where: {
                                fromUsers: {
                                    some: {
                                        id: session?.user?.id,
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
                            await prisma.notification.update({
                                where: {
                                    id: notification.id,
                                },
                                data: {
                                    updatedAt: new Date(),
                                },
                            });
                        }
                        else {
                            await prisma.notification.create({
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: session?.user?.id,
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
                    await prisma.post.create({
                        data: {
                            ...post,
                            authorId: session?.user?.id,
                        },
                    });
                    return {
                        success: true,
                        message: "Created post successfully",
                    };
                }
            }
        },
        updatePost: async (_parent, { id, post }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (post.files) {
                await prisma.post.update({
                    where: {
                        id,
                    },
                    data: {
                        ...post,
                        files: {
                            deleteMany: {},
                            createMany: {
                                data: post.files,
                            },
                        },
                    },
                    include: {
                        files: true,
                    },
                });
            }
            else {
                await prisma.post.update({
                    where: {
                        id,
                    },
                    data: {
                        ...post,
                        files: {
                            deleteMany: {},
                        },
                    },
                    include: {
                        files: true,
                    },
                });
            }
            return {
                success: true,
                message: "Updated post successfully",
            };
        },
        deletePost: async (_parent, { id }) => {
            await prisma.post.delete({
                where: {
                    id,
                },
            });
            return {
                success: true,
                message: "Deleted post successfully",
            };
        },
        // Users
        updateUser: async (_parent, { user }, context) => {
            try {
                const { session } = context;
                const userUpdate = await prisma.user.update({
                    where: {
                        id: session?.user?.id,
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
        },
        // Likes
        toggleLikePost: async (_parent, { postId, authorId, isLiked, }, context) => {
            const { session, prisma } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (isLiked) {
                await prisma.post.update({
                    where: {
                        id: postId,
                    },
                    data: {
                        likes: {
                            disconnect: {
                                id: session?.user.id,
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
                await prisma.post.update({
                    where: {
                        id: postId,
                    },
                    data: {
                        likes: {
                            connect: {
                                id: session?.user.id,
                            },
                        },
                    },
                });
                if (authorId !== session?.user.id) {
                    const notification = await prisma.notification.findFirst({
                        where: {
                            toUserId: authorId,
                            postId,
                            type: "LIKE_POST",
                        },
                    });
                    if (!notification) {
                        await prisma.notification.create({
                            data: {
                                fromUsers: {
                                    connect: {
                                        id: session?.user.id,
                                    },
                                },
                                toUserId: authorId,
                                postId,
                                type: "LIKE_POST",
                            },
                        });
                    }
                    else {
                        await prisma.notification.update({
                            where: {
                                id: notification.id,
                            },
                            data: {
                                fromUsers: {
                                    connect: {
                                        id: session?.user.id,
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
        },
        toggleLikeComment: async (_parent, { commentId, postId, authorId, isLiked, }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (isLiked) {
                await prisma.comment.update({
                    where: {
                        id: commentId,
                    },
                    data: {
                        likes: {
                            disconnect: {
                                id: session?.user?.id,
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
                await prisma.comment.update({
                    where: {
                        id: commentId,
                    },
                    data: {
                        likes: {
                            connect: {
                                id: session?.user?.id,
                            },
                        },
                    },
                });
                if (authorId !== session?.user.id) {
                    const notification = await prisma.notification.findFirst({
                        where: {
                            toUserId: authorId,
                            type: "COMMENT_REPLY",
                            postId,
                        },
                    });
                    if (!notification) {
                        await prisma.notification.create({
                            data: {
                                toUserId: authorId,
                                type: "LIKE_POST",
                                postId,
                                fromUsers: {
                                    connect: {
                                        id: session?.user?.id,
                                    },
                                },
                            },
                        });
                    }
                    else {
                        await prisma.notification.update({
                            where: {
                                id: notification.id,
                            },
                            data: {
                                fromUsers: {
                                    connect: {
                                        id: session?.user.id,
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
        },
        // follows
        followUser: async (_parent, { followingId, }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const follower = await prisma.user.update({
                where: { id: session?.user?.id },
                data: { followings: { connect: [{ id: followingId }] } },
            });
            const following = await prisma.user.update({
                where: { id: followingId },
                data: { followers: { connect: [{ id: session?.user?.id }] } },
            });
            const notification = await prisma.notification.findFirst({
                where: {
                    fromUsers: {
                        some: {
                            id: session?.user?.id
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
                await prisma.notification.update({
                    where: {
                        id: notification.id
                    },
                    data: {
                        fromUsers: {
                            connect: {
                                id: session?.user?.id
                            }
                        },
                        updatedAt: new Date()
                    }
                });
            }
            else {
                await prisma.notification.create({
                    data: {
                        toUserId: followingId,
                        fromUsers: {
                            connect: {
                                id: session?.user?.id
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
        },
        unFollowUser: async (_parent, { followingId }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const follower = await prisma.user.update({
                where: { id: session?.user?.id },
                data: { followings: { disconnect: [{ id: followingId }] } },
            });
            const following = await prisma.user.update({
                where: { id: followingId },
                data: {
                    followers: { disconnect: [{ id: session?.user?.id }] },
                },
            });
            return {
                success: true,
                message: `${follower.name} unFollow ${following.name}`,
            };
        },
        // notifications
        createNotification: async (_parent, { notification }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            await prisma.notification.create({
                data: {
                    fromUsers: {
                        connect: {
                            id: session?.user?.id,
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
        },
        deleteNotification: async (_parent, { id, userId }, context) => {
            const { prisma, session } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            if (id) {
                await prisma.notification.delete({
                    where: {
                        id,
                    },
                });
            }
            else {
                const notification = await prisma.notification.findFirst({
                    where: {
                        toUserId: userId,
                        fromUsers: {
                            every: {
                                id: session?.user.id,
                            },
                        },
                        type: "ADD_FRIEND"
                    },
                    select: {
                        id: true,
                    },
                });
                await prisma.notification.delete({
                    where: {
                        id: notification?.id,
                    },
                });
            }
            return {
                success: true,
                message: "Delete notification successfully",
            };
        },
        // Comments
        createComment: async (_parent, { comment, authorId }, context) => {
            const { prisma, session } = context;
            const { parentId, content, file, postId, replyUserId } = comment;
            try {
                if (!session?.user) {
                    throw new graphql_1.GraphQLError("Not authorized");
                }
                //  create notification reply user
                if (replyUserId) {
                    if (authorId !== session?.user?.id) {
                        const notification = await prisma.notification.findFirst({
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
                            await prisma.notification.create({
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: session?.user?.id,
                                        },
                                    },
                                    toUserId: replyUserId,
                                    type: "COMMENT_REPLY",
                                    postId,
                                },
                            });
                        }
                        else {
                            await prisma.notification.update({
                                where: {
                                    id: notification.id,
                                },
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: session?.user?.id,
                                        }
                                    },
                                    updatedAt: new Date(),
                                },
                            });
                        }
                    }
                }
                else {
                    if (authorId !== session?.user?.id) {
                        const notification = await prisma.notification.findFirst({
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
                            await prisma.notification.update({
                                where: {
                                    id: notification.id
                                },
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: session?.user?.id
                                        }
                                    },
                                    updatedAt: new Date()
                                }
                            });
                        }
                        else {
                            await prisma.notification.create({
                                data: {
                                    fromUsers: {
                                        connect: {
                                            id: session?.user?.id
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
                        await prisma.comment.create({
                            data: {
                                content,
                                postId,
                                userId: session?.user?.id,
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
                        await prisma.comment.create({
                            data: {
                                content,
                                postId,
                                userId: session?.user?.id,
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
                        await prisma.comment.create({
                            data: {
                                content,
                                postId,
                                userId: session?.user?.id,
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
                        await prisma.comment.create({
                            data: {
                                content,
                                postId,
                                userId: session?.user?.id,
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
        },
        deleteComment: async (_parent, { id }) => {
            await prisma.comment.delete({
                where: {
                    id,
                },
            });
            return {
                success: true,
                message: "Comment deleted success",
            };
        },
        // message
        sendMessage: async function (_, args, context) {
            const { session, prisma } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const { message } = args;
            const { conversationId, content, files, toUserId } = message;
            try {
                if (conversationId) {
                    if (files) {
                        const message = await prisma.message.create({
                            data: {
                                content,
                                conversationId,
                                senderId: session?.user?.id,
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
                        const message = await prisma.message.create({
                            data: {
                                content,
                                conversationId,
                                senderId: session?.user?.id,
                            }
                        });
                        return message;
                    }
                }
                else {
                    const conversationCreated = await prisma.conversation.create({
                        data: {
                            participants: {
                                connect: [{ id: session?.user?.id }, { id: toUserId }]
                            },
                        }
                    });
                    await prisma.message.create({
                        data: {
                            content,
                            conversationId: conversationCreated.id,
                            senderId: session?.user?.id,
                        }
                    });
                    const conversations = await prisma.conversation.findMany({
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
                    const conversation = conversations.find((conversation) => conversation.participants.some((p) => p.id === session?.user?.id && p.id === toUserId));
                    return conversation;
                }
            }
            catch (error) {
                throw new graphql_1.GraphQLError("Error sending message");
            }
        },
    },
};
exports.default = resolvers;
