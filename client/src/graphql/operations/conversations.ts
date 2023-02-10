import { gql } from '@apollo/client';

const CONVERSATION_OPERATIONS = {
  Queries: {
    findConversation: gql`
        query findConversation($userId: ID!) {
           findConversation(userId: $userId) {
               id
               messages {
                id
               content
               files {
               publicId
               type
               url
              }
              updatedAt
              sender {
              id
              name
              image
             }
    }
  }
}
        `
    ,
    getConversations: gql`
    query getConversations {
         conversations {
         id
         latestMessage {
          content
          updatedAt
          senderId
        }
         user {
          id
          name
          image
         }
       updatedAt
       _count {
          messages
       }
     }
}
    `
  },
  Mutations: {
  },
  Subscriptions: {},
};

export default CONVERSATION_OPERATIONS;
