import { createTransaction } from '@tharsis/proto'

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

export const MSG_CONVERT_ERC20_TYPES = {
  MsgValue: [
    { name: 'contractAddress', type: 'address' },
    { name: 'sender', type: 'address' },
    { name: 'receiver', type: 'string' },
    { name: 'amount', type: 'string' },
  ],
}

function createMsgConvertERC20(
  contractAddress: string,
  amount: string,
  fromAddress: string,
  toAddress: string,
) {
  return {
    type: 'cosmos-sdk/MsgConvertERC20',
    value: {
      amount,
      contractAddress,
      sender: fromAddress,
      receiver: toAddress,
    },
  }
}

export interface MsgConvertERC20Params {
  contractAddress: string
  destinationAddress: string
  amount: string
}

export function createMessageConvertERC20(
  chain: Chain,
  sender: Sender,
  fee: Fee,
  memo: string,
  params: MsgConvertERC20Params,
) {
  // EIP712
  const feeObject = generateFee(
    fee.amount,
    fee.denom,
    fee.gas,
    sender.accountAddress,
  )
  const types = generateTypes(MSG_CONVERT_ERC20_TYPES)

  const msg = createMsgConvertERC20(
    params.contractAddress,
    params.amount,
    sender.accountAddress,
    params.destinationAddress,
  )

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

  const message = new evmos.erc20.v1.MsgConvertERC20({
    contract_address: params.contractAddress,
    amount: params.amount,
    sender: sender.accountAddress,
    receiver: params.destinationAddress,
  })
  const msgSend = {
    message,
    path: 'evmos.erc20.v1.MsgConvertERC20',
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
