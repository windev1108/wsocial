import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
    uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        `http://localhost:5000/graphql`,
    credentials: 'include',
});

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
