import { gql } from '@apollo/client';

const MESSAGE_OPERATIONS = {
    Queries: {
    },
    Mutations: {
        sendMessage: gql`
        mutation sendMessage($message: MessageInput) {
              sendMessage(message: $message) {
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
        `
    },
    Subscriptions: {
        messageSent: gql`
          subscription messageSent {
            messageSent {
                id
                messages {
                content
                files {
                publicId
                type
               url
            }
              sender {
                id
                name
                image
             }
            updatedAt
            
    }
  }
}
        `
    },
};

export default MESSAGE_OPERATIONS;
