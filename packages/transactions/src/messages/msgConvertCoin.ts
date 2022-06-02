import { createTransaction } from '@tharsis/proto'

import * as coin from '@tharsis/proto/dist/proto/cosmos/base/v1beta1/coin'
import { evmos } from '@tharsis/proto/dist/proto/evmos/erc20/v1/tx'

import {
  createEIP712,
  generateFee,
  generateMessage,
  generateTypes,
  // createMsgSend,
  // MSG_SEND_TYPES,
} from '@tharsis/eip712'

import { Chain, Fee, Sender } from './common'

export const MSG_CONVERT_COIN_TYPES = {
  MsgValue: [
    { name: 'sender', type: 'string' },
    { name: 'receiver', type: 'address' },
    { name: 'coin', type: 'TypeCoin' },
  ],
  TypeCoin: [
    { name: 'denom', type: 'string' },
    { name: 'amount', type: 'string' },
  ],
}

function createMsgConvertCoin(
  amount: string,
  denom: string,
  fromAddress: string,
  toAddress: string,
) {
  return {
    type: '/evmos.erc20.v1.MsgConvertCoin',
    value: {
      coin: {
        denom,
        amount,
      },
      sender: fromAddress,
      receiver: toAddress,
    },
  }
}

export interface MsgConvertCoinParams {
  destinationAddress: string
  amount: string
  denom: string
}

export function createMessageConvertCoin(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MsgConvertCoinParams,
) {
  // EIP712
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress,
  )
  const types = generateTypes(MSG_CONVERT_COIN_TYPES)

  const msg = createMsgConvertCoin(
    params.amount,
    params.denom,
    sender.accountAddress,
    params.destinationAddress,
  )

  // const msg = createMsgSend(
  //   params.amount,
  //   params.denom,
  //   sender.accountAddress,
  //   params.destinationAddress,
  // )
  const messages = generateMessage(
    sender.accountNumber.toString(),
    sender.sequence.toString(),
    chain.cosmosChainId,
    memo,
    feeObject,
    msg,
  )
  const eipToSign = createEIP712(types, chain.chainId, messages)

  // Cosmos

  const value = new coin.cosmos.base.v1beta1.Coin({
    denom: params.denom,
    amount: params.amount,
  })

  const message = new evmos.erc20.v1.MsgConvertCoin({
    coin: value,
    sender: sender.accountAddress,
    receiver: params.destinationAddress,
  })
  const msgSend = {
    message,
    path: 'evmos.erc20.v1.MsgConvertCoin',
  }

  const tx = createTransaction(
    msgSend,
    memo,
    fee.amount,
    fee.denom,
    parseInt(fee.gas, 10),
    'ethsecp256',
    sender.pubkey,
    sender.sequence,
    sender.accountNumber,
    chain.cosmosChainId,
  )

  return {
    signDirect: tx.signDirect,
    legacyAmino: tx.legacyAmino,
    eipToSign,
  }
}
