import { gql } from '@apollo/client';

const NOTIFICATION_OPERATIONS = {
    Queries: {
        getMyInfo: gql`
            query getMyInfo($id: ID!) {
                getUserById(id: $id) {
                    id
                    name
                    image
                    friends {
                        id
                        name
                        image
                        liveAt
                        friends {
                            id
                        }
                    }
                    notificationsTo {
                        id
                        type
                        postId
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
                    notificationsFrom {
                        id
                        type
                        updatedAt
                        postId
                        toUser {
                            id
                            name
                            image
                        }
                    }
                }
            }
        `,
    },
    Mutations: {
        createNotification: gql`
            mutation Notification($notification: NotificationInput) {
                createNotification(notification: $notification) {
                    message
                    success
                }
            }
        `,
        deleteNotification: gql`
            mutation Notification($id: ID, $userId: ID) {
                deleteNotification(id: $id, userId: $userId) {
                    message
                    success
                }
            }
        `,
    },
    Subscriptions: {},
};

export default NOTIFICATION_OPERATIONS;
