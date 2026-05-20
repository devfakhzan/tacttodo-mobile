import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { persistCache } from "apollo3-cache-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GRAPHQL_URL =
  process.env.EXPO_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

export const apolloCache = new InMemoryCache();

let tokenGetter: () => string | null = () => null;

export function setTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

export async function initApolloCache(): Promise<void> {
  await persistCache({
    cache: apolloCache,
    storage: AsyncStorage,
  });
}

export function createApolloClient(): ApolloClient {
  const authLink = setContext((_, { headers }) => {
    const token = tokenGetter();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const httpLink = new HttpLink({ uri: GRAPHQL_URL });

  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: apolloCache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}
