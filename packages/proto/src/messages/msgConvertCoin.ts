import * as coin from '../proto/cosmos/base/v1beta1/coin'
import { evmos } from '../proto/evmos/erc20/v1/tx'

export function createMsgConvertCoin(
  fromAddress: string,
  toAddress: string,
  amount: string,
  denom: string,
) {
  const value = new coin.cosmos.base.v1beta1.Coin({
    denom,
    amount,
  })

  const message = new evmos.erc20.v1.MsgConvertCoin({
    coin: value,
    sender: fromAddress,
    receiver: toAddress,
  })
  return {
    message,
    path: 'evmos.erc20.v1.MsgConvertCoin',
  }
}
