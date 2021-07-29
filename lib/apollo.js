import { useMemo } from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  //Creating Instance
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://nextj-hasura.hasura.app/v1/graphql",
      headers: { 
        "x-hasura-admin-secret":
        "ADMIN_SECRET",  
        "content-type": "application/jaon" },
    }),
    cache: new InMemoryCache(),
  });
};

let applloclient;
let initialState;

export default function initializeApollo(inirialSate = null) {
  const _apolloClient = applloclient ? applloclient : createApolloClient(); //Reusing Instance
  // if initialState
  if (initialState) {
    const exisitingCache = _apolloClient.extract(); //fetch the cache from the client intstant
    _apolloClient.cache.restore({ ...exisitingCache, ...initialState }); //Restore Cache
  }
  //if the mode is SSR
  if (typeof window === "undefined") return _apolloClient;

  //create client once on the frontend
  if (!_apolloClient) applloclient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
