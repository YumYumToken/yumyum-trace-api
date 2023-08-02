import { getAddress } from '@ethersproject/address'
import { NowRequest, NowResponse } from '@now/node'
import BigNumber from 'bignumber.js'

import { getSwaps, sortedFormatted } from './_shared'
import { return200, return400, return500 } from './utils/response'

export default async function(req: NowRequest, res: NowResponse): Promise<void> {
  if (
    !req.query.pair ||
    typeof req.query.pair !== 'string' ||
    !/^0x[0-9a-fA-F]{40}_0x[0-9a-fA-F]{40}$/.test(req.query.pair)
  ) {
    return400(res, 'Invalid pair identifier: must be of format tokenAddress_tokenAddress')
    return
  }

  const [tokenA, tokenB] = req.query.pair.split('_')
  let idA: string, idB: string
  try {
    ;[idA, idB] = [getAddress(tokenA), getAddress(tokenB)]
  } catch (error) {
    return400(res)
    return
  }

  try {
    const swaps = await getSwaps(idA, idB)
    const [token0] = sortedFormatted(tokenA, tokenB)
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const ret = swaps.map(swap => {
      const amountA = token0 === tokenA ? new BigNumber(swap.amount0) : new BigNumber(swap.amount1)
      const amountB = token0 === tokenB ? new BigNumber(swap.amount0) : new BigNumber(swap.amount1)
      let isBuy, isSell, isBorrowBoth
      if (amountA.gt(new BigNumber(0)) && amountB.lt(new BigNumber(0))) {
        ;(isBuy = true), (isSell = false), (isBorrowBoth = false)
      } else if (amountA.lt(new BigNumber(0)) && amountB.gt(new BigNumber(0))) {
        ;(isBuy = false), (isSell = true), (isBorrowBoth = false)
      } else {
        ;(isBuy = false), (isSell = false), (isBorrowBoth = true)
      }
      const type = isBuy ? 'buy' : isSell ? 'sell' : isBorrowBoth ? 'borrow-both' : '???'
      const baseAmount = amountA.abs().toString()
      const quoteAmount = amountB.abs().toString()
      return {
        trade_id: swap.id,
        base_volume: baseAmount,
        quote_volume: quoteAmount,
        type,
        trade_timestamp: swap.timestamp,
        price:
          baseAmount !== '0' ? new BigNumber(quoteAmount).dividedBy(new BigNumber(baseAmount)).toString() : undefined
      }
    })
    return200(
      res,
      ret,
      60 * 15 // cache for 15 minutes
    )
  } catch (error) {
    return500(res, error as Error)
  }
}
