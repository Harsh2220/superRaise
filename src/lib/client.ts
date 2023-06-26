import { LENS_API_URL } from "@/constants";
import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";

const httpLink = new HttpLink({
  uri: LENS_API_URL,
  fetch,
});

const lensClient = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache(),
});

export default lensClient;
