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
        `,
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
