import { gql } from "apollo-server-express";
const typeDefs = gql `
  type User {
    id: ID
    name: String
    nickname: String
    email: String
    image: String
    background: String
    birthday: String
    phone: String
    gender: Gender
    website: String
    liveAt: String
    facebook: String
    instagram: String
    twitter: String
    linkedin: String
    posts(isMySelf: Boolean, isFriend: Boolean): [Post]
    friends: [User]
    notificationsFrom: [Notification]
    notificationsTo: [Notification]
    notFriends: [User]
    isSendAddFriend: Boolean
    isReceiveAddFriend: Boolean
    isMySelf: Boolean
    isFriend: Boolean
    isFollowing: Boolean
    followers: [User]
    followings: [User]
    isOnline: Boolean
    lastTime: String
    _count: CountUser
  }

  type CountUser {
    followers: Int
    followings: Int
    messages: Int
  }

  type Post {
    id: ID
    viewer: String
    content: String
    files: [File]
    likes: [User]
    comments: [Comment]
    authorId: String
    author: User
    activity: Activity
    postSharedOf: postSharedOf
    createdAt: String
    updatedAt: String
    _count: CountPost
  }

  type postSharedOf {
    id: ID
    viewer: String
    content: String
    files: [File]
    author: User
    activity: Activity
    postSharedOf: Post
    updatedAt: String
  }

  type File {
    id: ID
    postId: String
    url: String
    type: String
    publicId: String
  }

  input PostInput {
    viewer: String
    content: String
    activity: Activity
    files: [FileInput]
    postIdShared: String
  }


  input UserInput {
    name: String
    email: String
    image: String
    nickname: String
    background: String
    gender: Gender
    facebook: String
    instagram: String
    twitter: String
    linkedin: String
    phone: String
    website: String
    liveAt: String
    birthday: String
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  input FileInput {
    url: String
    type: String
    publicId: String
  }

  type Notification {
    id: String
    fromUsers: [User]
    toUser: User
    post: Post
    postId: String
    type: String
    createdAt: String
    updatedAt: String
  }

  input NotificationInput {
    toUserId: String
    type: String
    postId: String
  }

  input CommentInput {
    postId: String
    file: FileInput
    content: String
    parentId: String
    replyUserId: String
  }

  input MessageInput {
    content: String
    files: [FileInput]
    conversationId: String
    toUserId: String
  }

  input FileInput {
    publicId: String
    url: String
    type: String
  }

  enum Activity {
    CREATED_POST
    UPDATE_AVATAR
    UPDATE_BACKGROUND
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type Comment {
    id: String
    postId: String
    userId: String
    post: Post
    user: User
    file: File
    fileId: String
    childComment: [Comment]
    commentOf: [Comment]
    likes: [User]
    replyToUser: User
    replyUserId: String
    content: String
    createdAt: String
    updatedAt: String
  }

  type CountPost {
    comments: Int
    postShared: Int
  }

  type Conversation {
    id: String
    latestMessage: Message
    messages: [Message]
    participants: [User]
    user: User
    _count: CountMessage
    updatedAt: String
  }

  type CountMessage {
    messages: Int
    messagesNotSeen: Int
  }



  type Message {
    id: String
    content: String
    files: [File]
    sender: User
    senderId: String
    conversation: Conversation
    createdAt: String
    updatedAt: String
  }



  
  type ConversationDeletedResponse {
    id: String
  }

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
    addedUserIds: [String]
    removedUserIds: [String]
  }

  # ROOT TYPE
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
    getPosts(userId: String, viewer: String, take: Int): [Post]
    getPostById(id: ID!): Post
    conversations: [Conversation]
    findConversation(userId: ID!): Conversation
  }

  # MUTATION TYPE
  type Mutation {
    updateUser(user: UserInput): GraphQLResponse

    createPost(post: PostInput): GraphQLResponse
    updatePost(id: ID!, post: PostInput): GraphQLResponse
    deletePost(id: ID!): GraphQLResponse

    # like post
    toggleLikePost(
      postId: ID!
      authorId: ID!
      isLiked: Boolean
    ): GraphQLResponse

    # like comment
    toggleLikeComment(
      commentId: ID!
      postId: ID
      isLiked: Boolean
      authorId: ID!
    ): GraphQLResponse

    # friendship
    addFriendship(userIdB: String): GraphQLResponse
    removeFriendship(userIdB: String): GraphQLResponse

    # follower
    followUser(followingId: String): GraphQLResponse
    unFollowUser(followingId: String): GraphQLResponse

    # notifications
    createNotification(notification: NotificationInput): GraphQLResponse
    deleteNotification(id: ID, userId: ID): GraphQLResponse

    # comments
    createComment(comment: CommentInput, authorId: ID): GraphQLResponse
    deleteComment(id: ID): GraphQLResponse

    # message
    sendMessage(message: MessageInput): Message
  }

  
  type GraphQLResponse {
    success: Boolean
    message: String
  }
`;
export default typeDefs;
