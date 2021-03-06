import Vue from "vue";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import {
  IntrospectionFragmentMatcher,
  InMemoryCache
} from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";
import "isomorphic-fetch";
import https from "https";
import introspectionQueryResultData from "~/fragmentTypes.json";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: "https://headless-wp.dev/graphql",
  fetchOptions: {
    agent: new https.Agent({ rejectUnauthorized: false })
  }
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({ fragmentMatcher }),
  connectToDevTools: true
});

// Install the vue plugin
Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

export default ({ app }, inject) => {
  app.provide = apolloProvider.provide();
};
