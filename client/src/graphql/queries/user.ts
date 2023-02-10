import { gql } from '@apollo/client';

const USER_QUERIES = {
    getUsers: gql`
        query Users {
            users {
                id
                name
                email
            }
        }
    `,
    getUserById: gql`
        query getUserById($id: ID!) {
            getUserById(id: $id) {
                id
                name
                nickname
                email
                image
                background
                birthday
                phone
                gender
                website
                liveAt
                facebook
                instagram
                twitter
                linkedin
                isFriend
                isMySelf
                isSendAddFriend
                isReceiveAddFriend
                isFollowing
                friends {
                    id
                    name
                    image
                    liveAt
                    friends {
                        id
                    }
                    followers {
                        id
                    }
                }
                followings {
                    id
                    name
                    image
                }
                followers {
                    id
                    name
                    image
                }
                notificationsTo {
                    id
                    type
                    updatedAt
                    fromUsers {
                        id
                        name
                        image
                    }
                    toUser {
                        id
                        name
                        image
                    }
                }
            }
        }
    `,
    getMyCommunity: gql`
        query getMyCommunity($id: ID!) {
            getUserById(id: $id) {
                followers {
                    id
                    name
                    image
                }
                followings {
                    id
                    name
                    image
                }
                notFriends {
                    id
                    name
                    image
                    isSendAddFriend
                    isReceiveAddFriend
                }
                friends {
                    id
                    name
                    image
                }
            }
        }
    `,
};

export default USER_QUERIES;
