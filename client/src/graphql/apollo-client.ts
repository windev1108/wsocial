import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getSession } from 'next-auth/react';

const wsLink =
    typeof window !== 'undefined'
        ? new GraphQLWsLink(
              createClient({
                  url:
                      process.env.NEXT_PUBLIC_WS_GRAPHQL_ENDPOINT ??
                      'ws://localhost:5000/graphql/subscriptions',
                  connectionParams: async () => ({
                      session: await getSession(),
                  }),
              })
          )
        : null;

const httpLink = new HttpLink({
    uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        `http://localhost:5000/graphql`,
    credentials: 'include',
});

const link =
    typeof window !== 'undefined' && wsLink != null
        ? split(
              ({ query }) => {
                  const def = getMainDefinition(query);
                  return (
                      def.kind === 'OperationDefinition' &&
                      def.operation === 'subscription'
                  );
              },
              wsLink,
              httpLink
          )
        : httpLink;

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});
