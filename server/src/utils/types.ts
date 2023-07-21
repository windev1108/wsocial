import type { PrismaClient } from "@prisma/client";
import { Context } from "graphql-ws/lib/server";

export interface Session {
  user?: User;
}

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface SocketUser {
  userId: string;
  socketId: string;
  isOnline: boolean;
  isTyping?: boolean;
  lastTime: Date | null;
}

export interface PeerUser {
  id: string;
  name: string;
  image: string;
  peerId: string;
}

export interface User {
  id: string;
  name: string;
  nickname: string;
  background: string;
  gender: Gender;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  phone: Number;
  website: string;
  liveAt: string;
  birthday: Number;
  isSendAddFriend?: boolean;
}

enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export enum TypeNotification {
  ADD_FRIEND,
  FOLLOW_USER,
  SHARE_POST,
  LIKE_POST,
}

export interface Post {
  id: string;
  content: string;
  files: File[];
  userId: string;
  postSharedOf: [Post];
  authorId: string;
  activity: any;
}

interface File {
  url: string;
  type: any;
  postId?: string;
  publicId: string;
}

export enum Viewer {
  PUBLIC,
  FRIENDS,
  PRIVATE,
}

export interface NotificationInput {
  toUserId: string;
  type: string;
  postId?: string;
}

export interface CommentInput {
  postId: string;
  file: File;
  content: string;
  parentId: string;
  replyUserId: string;
}

export interface Message {
  content: string;
  files: File[];
  updatedAt: String;
  createdAt: String;
}

export interface MessageInput {
  content: string;
  files: [File];
  conversationId: string;
  toUserId?: string;
}

export interface Conversation {
  participants: User[];
  messages: Message[];
}

/**
 * Messages
 */
export interface SendMessageArguments {
  message: {
    id: string;
    conversationId: string;
    toUserId: string;
    content: string;
    files: File[];
  };
}
