export interface User {
    id: string;
    email: string;
    image: string;
    gender: string
    background?: string;
    liveAt?: string;
    name: string;
    nickname?: string;
    phone?: string;
    birthday?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    friends?: User[];
    followings?: User[]
    followers?: User[]
    isMySelf: boolean
    isFriend: boolean
    isSendAddFriend: boolean;
    isReceiveAddFriend: boolean;
}

export interface SocketUser {
    userId: string,
    socketId: string
    isOnline: boolean
    lastTime?: Date
}

export interface UserSession {
    expires: string;
    user: User;
}

export interface Post {
    id?: string;
    content?: string;
    files?: File[];
    likes?: User[];
    comments?: Comment[]
    author?: User;
    viewer?: string;
    createdAt?: string;
    updatedAt?: string
    postSharedOf: Post
    activity: string
    _count?: { comments?: number, postShared: number }
}

export interface Comment {
    id: string
    content: string
    file?: File
    user: User
    post: Post
    likes: User[]
    childComment: Comment[]
    replyToUser?: User
    createdAt: string
    updatedAt: string
}

export interface PostInput {
    viewer: string;
    content: string;
    files: File[];
    authorId: string;
}

export interface File {
    id?: string;
    url: string;
    type: string;
    publicId: string;
}

export interface Notification {
    id: string;
    type: string;
    fromUsers: User[];
    toUser: User;
    post: Post;
    postId: string
    createdAt: string;
    updatedAt: string
}

export interface Conversation {
    conversationId: string;
    participants: User[];
    messages: Message[];
}

export interface Message {
    id: string
    content: string
    files: File[]
    sender: User
    createdAt: string
    updatedAt: string
}

export interface NotificationInput {
    notification: {
        toUserId: string;
        postId?: string;
        type: string;
    };
}

export interface createNotificationResponse {
    createNotification: {
        success: boolean;
        message: string;
    };
}


export interface createCommentInput {
    comment: {
        postId?: string
        file?: File
        content: string
        parentId?: string
        replyUserId?: string | null
    },
    authorId: string
}


export interface createCommentResponse {
    createComment: {
        success: boolean;
        message: string;
    };
}

export interface deleteCommentResponse {
    deleteComment: {
        success: boolean;
        message: string;
    };
}

export interface toggleLikeCommentResponse {
    toggleLikeComment: {
        success: boolean;
        message: string;
    };
}

export interface ToggleLikePostInput {
    toggleLikePost: {
        postId: string
        authorId?: string
        isLiked: boolean
    }
}


export interface ToggleLikePostResponse {
    toggleLikePost: {
        success: boolean;
        message: string;
    }
}