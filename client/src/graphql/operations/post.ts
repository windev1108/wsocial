import { gql } from '@apollo/client';
// @ts-ignore

const POST_OPERATIONS = {
    Queries: {
        getPosts: gql`
            query getPosts($userId: String, $viewer: String, $take: Int) {
                getPosts(userId: $userId, viewer: $viewer, take: $take) {
                    id
                    content
                    viewer
                    activity
                    updatedAt
                    _count {
                        comments
                        postShared
                    }
                    files {
                        id
                        url
                        type
                        publicId
                    }
                    likes {
                        id
                        name
                        image
                    }
                    author {
                        id
                        name
                        image
                        gender
                        followers {
                            id
                        }
                        friends {
                            id
                        }
                    }
                    postSharedOf {
                        id
                        content
                        updatedAt
                        viewer
                        activity
                        files {
                            id
                            url
                            publicId
                            type
                        }
                        author {
                            id
                            name
                            image
                        }
                    }
                    comments {
                        id
                        content
                        createdAt
                        updatedAt
                        user {
                            id
                            name
                            image
                        }
                        file {
                            publicId
                            type
                            url
                        }
                        likes {
                            id
                            name
                            image
                        }
                        childComment {
                            id
                            content
                            file {
                                publicId
                                type
                                url
                            }
                            user {
                                id
                                name
                                image
                            }
                            file {
                                publicId
                                type
                                url
                            }
                            likes {
                                id
                                name
                                image
                            }
                            replyToUser {
                                id
                                name
                                image
                            }
                            createdAt
                            updatedAt
                            childComment {
                                id
                                content
                                createdAt
                                updatedAt
                                replyToUser {
                                    id
                                    name
                                    image
                                }
                                user {
                                    id
                                    name
                                    image
                                }
                                file {
                                    publicId
                                    type
                                    url
                                }
                                likes {
                                    id
                                    name
                                    image
                                }
                            }
                        }
                    }
                }
            }
        `,
        getPostInProfile: gql`
            query getPostInProfile(
                $id: ID!
                $isFriend: Boolean
                $isMySelf: Boolean
            ) {
                getUserById(id: $id) {
                    posts(isFriend: $isFriend, isMySelf: $isMySelf) {
                        id
                        content
                        viewer
                        activity
                        updatedAt
                        _count {
                            comments
                            postShared
                        }
                        files {
                            id
                            url
                            type
                            publicId
                        }
                        likes {
                            id
                            name
                            image
                        }
                        author {
                            id
                            name
                            image
                            followers {
                                id
                            }
                            friends {
                                id
                            }
                        }
                        postSharedOf {
                            id
                            content
                            viewer
                            updatedAt
                            files {
                                id
                                url
                                publicId
                                type
                            }
                            author {
                                id
                                name
                                image
                            }
                        }
                        comments {
                            id
                            content
                            createdAt
                            updatedAt
                            user {
                                id
                                name
                                image
                            }
                            file {
                                publicId
                                type
                                url
                            }
                            likes {
                                id
                                name
                                image
                            }
                            childComment {
                                id
                                content
                                file {
                                    publicId
                                    type
                                    url
                                }
                                user {
                                    id
                                    name
                                    image
                                }
                                file {
                                    publicId
                                    type
                                    url
                                }
                                likes {
                                    id
                                    name
                                    image
                                }
                                replyToUser {
                                    id
                                    name
                                    image
                                }
                                createdAt
                                updatedAt
                                childComment {
                                    id
                                    content
                                    createdAt
                                    updatedAt
                                    replyToUser {
                                        id
                                        name
                                        image
                                    }
                                    user {
                                        id
                                        name
                                        image
                                    }
                                    file {
                                        publicId
                                        type
                                        url
                                    }
                                    likes {
                                        id
                                        name
                                        image
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        getPostById: gql`
            query getPostById($id: ID!) {
                getPostById(id: $id) {
                    id
                    content
                    viewer
                    activity
                    updatedAt
                    createdAt
                    _count {
                        comments
                        postShared
                    }
                    files {
                        id
                        url
                        type
                        publicId
                    }
                    likes {
                        id
                        name
                        image
                    }
                    author {
                        id
                        name
                        image
                        background
                    }
                    postSharedOf {
                        id
                        content
                        viewer
                        updatedAt
                        files {
                            id
                            url
                            publicId
                            type
                        }
                        author {
                            id
                            name
                            image
                            background
                        }
                    }
                    comments {
                        id
                        content
                        createdAt
                        updatedAt
                        user {
                            id
                            name
                            image
                        }
                        file {
                            publicId
                            type
                            url
                        }
                        likes {
                            id
                            name
                            image
                        }
                        childComment {
                            id
                            content
                            file {
                                publicId
                                type
                                url
                            }
                            user {
                                id
                                name
                                image
                            }
                            file {
                                publicId
                                type
                                url
                            }
                            likes {
                                id
                                name
                                image
                            }
                            replyToUser {
                                id
                                name
                                image
                            }
                            createdAt
                            updatedAt
                            childComment {
                                id
                                content
                                createdAt
                                updatedAt
                                replyToUser {
                                    id
                                    name
                                    image
                                }
                                user {
                                    id
                                    name
                                    image
                                }
                                file {
                                    publicId
                                    type
                                    url
                                }
                                likes {
                                    id
                                    name
                                    image
                                }
                            }
                        }
                    }
                }
            }
        `,
    },
    Mutations: {
        createPost: gql`
            mutation Post($post: PostInput) {
                createPost(post: $post) {
                    success
                    message
                }
            }
        `,
        updatePost: gql`
            mutation Post($id: ID!, $post: PostInput) {
                updatePost(id: $id, post: $post) {
                    success
                    message
                }
            }
        `,
        createComment: gql`
            mutation Comment($comment: CommentInput, $authorId: ID!) {
                createComment(comment: $comment, authorId: $authorId) {
                    message
                    success
                }
            }
        `,
        deleteComment: gql`
            mutation Comment($id: ID!) {
                deleteComment(id: $id) {
                    message
                    success
                }
            }
        `,
        deletePost: gql`
            mutation Post($id: ID!) {
                deletePost(id: $id) {
                    success
                    message
                }
            }
        `,
        toggleLikePost: gql`
            mutation LikePost($postId: ID!, $isLiked: Boolean, $authorId: ID!) {
                toggleLikePost(
                    postId: $postId
                    isLiked: $isLiked
                    authorId: $authorId
                ) {
                    success
                    message
                }
            }
        `,
        toggleLikeComment: gql`
            mutation ToggleLikeComment($commentId: ID!, $isLiked: Boolean, $authorId: ID!) {
                toggleLikeComment(commentId: $commentId, isLiked: $isLiked, authorId: $authorId) {
                    message
                    success
                }
            }
        `,
    },
    Subscriptions: {
        onLikePosts: gql`
            subscription OnLikePost($userId: ID!) {
                onLikePost(userId: $userId) {
                    id
                    content
                    viewer
                    createdAt
                    _count {
                        comments
                    }
                    files {
                        id
                        url
                        type
                        publicId
                    }
                    likes {
                        id
                        name
                        image
                    }
                    author {
                        id
                        name
                        image
                        background
                    }
                    comments {
                        id
                        content
                        createdAt
                        updatedAt
                        user {
                            id
                            name
                            image
                        }
                        file {
                            publicId
                            type
                            url
                        }
                        likes {
                            id
                            name
                            image
                        }
                        childComment {
                            id
                            content
                            file {
                                publicId
                                type
                                url
                            }
                            user {
                                id
                                name
                                image
                            }
                            file {
                                publicId
                                type
                                url
                            }
                            likes {
                                id
                                name
                                image
                            }
                            replyToUser {
                                id
                                name
                                image
                            }
                            createdAt
                            updatedAt
                            childComment {
                                id
                                content
                                createdAt
                                updatedAt
                                replyToUser {
                                    id
                                    name
                                    image
                                }
                                user {
                                    id
                                    name
                                    image
                                }
                                file {
                                    publicId
                                    type
                                    url
                                }
                                likes {
                                    id
                                    name
                                    image
                                }
                            }
                        }
                    }
                }
            }
        `,
    },
};

export default POST_OPERATIONS;
