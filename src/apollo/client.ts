import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'

export default new ApolloClient({
  link: new HttpLink({
    fetch,
    uri: 'https://api.studio.thegraph.com/query/49959/yumyum-subgraph-base/version/latest'
  }),
  cache: new InMemoryCache()
})
