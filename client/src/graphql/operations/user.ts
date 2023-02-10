import { gql } from '@apollo/client';
// @ts-ignore

const USER_OPERATIONS = {
    Queries: {
        getMyFriends: gql`
        query getUserById($id: ID!) {
            getUserById(id: $id) {
                friends {
                    id
                    name
                    image
                    liveAt
                    friends {
                        id
                    }
                }
            }
        }
    `,
        getMyInfo: gql`
            query getUserById($id: ID!){
                getUserById(id: $id) {
                    id
                    name
                    image
            }  
            }
        `
    },
    Mutations: {
        updateUser: gql`
            mutation User($user: UserInput) {
                updateUser(user: $user) {
                    success
                    message
                }
            }
        `,
        addFriendship: gql`
            mutation Friendship($userIdB: String) {
                addFriendship(
                    userIdB: $userIdB
                ) {
                    message
                    success
                }
            }
        `,
        removeFriendship: gql`
            mutation Friendship($userIdB: String) {
                removeFriendship(userIdB: $userIdB) {
                    message
                    success
                }
            }
        `,

        followUser: gql`
            mutation Follow($followingId: String) {
                followUser(followingId: $followingId) {
                    success
                    message
                }
            }
        `,
        unFollowUser: gql`
            mutation Follow($followingId: String) {
                unFollowUser(followingId: $followingId) {
                    success
                    message
                }
            }
        `,
    },
};

export default USER_OPERATIONS;
