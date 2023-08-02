# YumyumSwap API

The YumyumSwap API is a set of endpoints used by market aggregators (e.g. coinmarketcap.com) to surface YumyumSwap liquidity
and volume information. All information is fetched from the underlying subgraphs.

The API is designed around the CoinMarketCap
[requirements document](https://docs.google.com/document/d/1S4urpzUnO2t7DmS_1dc4EL4tgnnbTObPYXvDeBnukCg).

Prefer the YumyumSwap subgraph for any YumyumSwap queries whenever possible.

YumyumSwap Subgraph: https://api.studio.thegraph.com/query/49959/yumyum-subgraph-base/version/latest

# YumyumSwap Endpoints

All YumyumSwap pairs consist of two different tokens. ETH is not a native currency in YumyumSwap, and is represented
only by WETH in the pairs.

The canonical WETH address used by the YumyumSwap interface is `0x4200000000000000000000000000000000000006`.

## [`/summary`](https://api.yumyumswap.com/summary)

Returns data for the top ~1000 YumyumSwap pairs, sorted by reserves.
Results are edge cached for 15 minutes.

### Request

`GET https://api.yumyumswap.com/summary`

### Response

```json5
{
  "0x..._0x...": {                  // the asset ids of the BEP20 tokens (i.e. token addresses), joined by an underscore
    "last_price": "1.234",          // denominated in token0/token1
    "base_volume": "123.456",       // last 24h volume denominated in token0
    "quote_volume": "1234.56"       // last 24h volume denominated in token1
    "pair_liquidity": "1234.56"     // Pair liquidity in USD
  },
  // ...
}
```

## [`/totalliquidity`](https://api.yumyumswap.com/totalliquidity)

Returns the total liquidity in USD value on YumyumSwap.
Results are edge cached for 24 hours.

### Request

`GET https://api.yumyumswap.com/totalliquidity`

### Response

```json5
{
  "result": {
    "totalLiquidityUSD": "...", // Total liquidity in USD
  }
}
```

## [`/assets`](https://api.yumyumswap.com/assets)

Returns the tokens in the top ~1000 pairs on YumyumSwap, sorted by reserves.
Results are edge cached for 24 hours.

### Request

`GET https://api.yumyumswap.com/assets`

### Response

```json5
{
  // ...,
  "0x...": {              // the address of the BEP20 token
    "name": "...",        // not necesssarily included for BEP20 tokens
    "symbol": "...",      // not necesssarily included for BEP20 tokens
    "id": "0x...",        // the address of the BEP20 token
    "maker_fee": "0",     // always 0
    "taker_fee": "0.003", // always 0.003 i.e. .3%
  },
  // ...
}
```

## [`/tickers`](https://api.yumyumswap.com/tickers)

Returns data for the top ~1000 YumyumSwap pairs, sorted by reserves.
Results are edge cached for 1 minute.

### Request

`GET https://api.yumyumswap.com/tickers`

### Response

```json5
{
  "0x..._0x...": {                    // the asset ids of BNB and BEP20 tokens, joined by an underscore
    "base_name": "...",             // token0 name
    "base_symbol": "...",           // token0 symbol
    "base_id": "0x...",             // token0 address
    "quote_name": "...",            // token1 name
    "quote_symbol": "...",          // token1 symbol
    "quote_id": "0x...",            // token1 address
    "last_price": "1.234",          // the mid price as token1/token0
    "base_volume": "123.456",       // denominated in token0
    "quote_volume": "1234.56"       // denominated in token1
  },
  // ...
}
```

## `/orderbook/:pair`

Returns simulated orderbook data for the given YumyumSwap pair.
Since YumyumSwap has a continuous orderbook, fixed amounts in an interval are chosen for bids and asks,
and prices are derived from the YumyumSwap formula (accounting for both slippage and fees paid to LPs).
Results are edge cached for 15 minutes.

### Request

`GET https://api.yumyumswap.com/orderbook/:pair`

### URL Parameters

- `pair`: The asset ids of two BEP20 tokens, joined by an underscore, e.g. `0x..._0x...`. The first token address is considered the base in the response.

### Response

```json5
{
  "timestamp": 1234567, // UNIX timestamp of the response
  "bids": [
    ["12", "1.2"],      // denominated in base token, quote token/base token
    ["12", "1.1"],      // denominated in base token, quote token/base token
    // ...
  ],
  "asks": [
    ["12", "1.3"],      // denominated in base token, quote token/base token
    ["12", "1.4"],      // denominated in base token, quote token/base token
    // ...
  ]
}
```

## `/trades/:pair`

Returns all swaps in the last 24 hours for the given YumyumSwap pair.
Results are edge cached for 15 minutes.

The pair address is the address of the two tokens in either order.
The first address is considered the base in the response.

Note because YumyumSwap supports flash swaps and borrowing of both tokens in a pair, you may wish to exclude these
trade types (types `"???"` and `"borrow-both"`).

### URL Parameters

- `pair`: The asset ids of two BEP20 tokens, joined by an underscore, e.g. `0x..._0x...`. The first token address is considered the base in the response.

### Request

`GET https://api.yumyumswap.com/trades/:pair`

### Response

```json5
[
  {
    "trade_id": "...",
    "price": "1.234",           // denominated in quote token/base token
    "base_volume": "123.456",   // denominated in base token
    "quote_volume": "1234.56",  // denominated in quote token
    "trade_timestamp": 1234567, // UNIX timestamp
    "type": "buy"               // "buy"/"sell"/"borrow-both"/"???"
  },
  // ...
]
```


# build commands
nvm use 16.16.0
yarn generate