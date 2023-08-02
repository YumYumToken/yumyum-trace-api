import gql from 'graphql-tag'

export const PAIRS_VOLUME_QUERY_STRING = `
  query PairsVolume($limit: Int!, $pairIds: [ID!]!) {
    pairVolumes: pools(first: $limit, where: { id_in: $pairIds }, __BLOCK_NUMBER__) {
      id
      volumeToken0
      volumeToken1
    }
  }
`

export const PAIRS_VOLUME_QUERY = gql`
  query PairsVolume($limit: Int!, $pairIds: [ID!]!) {
    pairVolumes: pools(first: $limit, where: { id_in: $pairIds }) {
      id
      volumeToken0
      volumeToken1
    }
  }
`

// gets the top 1k pools by USD reserves
export const TOP_PAIRS = gql`
  fragment TokenInfo on Token {
    id
    symbol
    name
  }

  query TopPairs($limit: Int!, $excludeTokenIds: [String!]!) {
    pools(
      first: $limit
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { token0_not_in: $excludeTokenIds, token1_not_in: $excludeTokenIds }
    ) {
      id
      token0 {
        ...TokenInfo
      }
      token1 {
        ...TokenInfo
      }
      totalValueLockedToken0
      totalValueLockedToken1
      volumeToken0
      volumeToken1
      totalValueLockedUSD
    }
  }
`

export const PAIR_RESERVES_BY_TOKENS = gql`
  query PairReserves($token0: String!, $token1: String!) {
    pools(where: { token0: $token0, token1: $token1} ) {
      totalValueLockedToken0
      totalValueLockedToken1
    }
  }
`

export const SWAPS_BY_PAIR= gql`
  query SwapsByPair($skip: Int!, $timestamp: BigInt!, $pairIds: [ID!]!) {
    swaps(skip: $skip, where: { timestamp_gte: $timestamp, pool_in: $pairIds  }, orderBy: timestamp, orderDirection: asc) {
      id
      timestamp
      amount0
      amount1
    }
  }
`

export const PAIR_FROM_TOKENS = gql`
  query SwapsByTokens( $token0: String!, $token1: String!) {
    pools(where: { token0: $token0, token1: $token1 }) {
      id
    }
  }
`

export const TOTAL_LIQUIDITY = gql`
  query TotalLiquidity {
    factories {
      totalValueLockedUSD
    }
  }
`
