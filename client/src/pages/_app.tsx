import '../styles/globals.css'
import 'moment/locale/vi';
import type { AppProps } from 'next/app'
import { store } from './../redux/store'
import { Provider } from 'react-redux'
import NextNProgress from "nextjs-progressbar";
import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from "next-auth/react";
import { client } from '@/graphql/apollo-client';
import { ApolloProvider } from '@apollo/client';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <Provider store={store}>
          <NextNProgress color="#377dff" options={{ showSpinner: false }} />
          <Component {...pageProps} />
        </Provider>
      </SessionProvider>
    </ApolloProvider>
  )
}

export default appWithTranslation(App)