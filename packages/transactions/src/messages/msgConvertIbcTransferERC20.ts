import {
  createIBCMsgTransfer as protoCreateIBCMsgTransfer,
  createTransactionWithMultipleMessages,
} from '@tharsis/proto'

import { evmos } from '@tharsis/proto/dist/proto/evmos/erc20/v1/tx'

// import {
//   createEIP712,
//   createIBCMsgTransfer,
//   generateFee,
//   generateMessageWithMultipleTransactions,
//   generateTypes,
//   // createMsgSend,
//   // MSG_SEND_TYPES,
// } from '@tharsis/eip712'

import { Chain, Fee, Sender } from './common'
import { MessageIBCMsgTransfer } from './ibcMsgTransfer'

export const MSG_CONVERT_IBC_TRANSFER_ERC20_TYPES = {
  MsgValue: [
    { name: 'contractAddress', type: 'address' },
    { name: 'sender', type: 'address' },
    { name: 'receiver', type: 'string' },
    { name: 'amount', type: 'string' },
    { name: 'source_port', type: 'string' },
    { name: 'source_channel', type: 'string' },
    { name: 'token', type: 'TypeToken' },
    { name: 'receiver', type: 'string' },
    { name: 'timeout_height', type: 'TypeTimeoutHeight' },
    { name: 'timeout_timestamp', type: 'uint64' },
  ],
  TypeToken: [
    { name: 'denom', type: 'string' },
    { name: 'amount', type: 'string' },
  ],
  TypeTimeoutHeight: [
    { name: 'revision_number', type: 'uint64' },
    { name: 'revision_height', type: 'uint64' },
  ],
}

// function createMsgConvertERC20(
//   contractAddress: string,
//   amount: string,
//   fromAddress: string,
//   toAddress: string,
// ) {
//   return {
//     type: 'cosmos-sdk/MsgConvertERC20',
//     value: {
//       amount,
//       contractAddress,
//       sender: fromAddress,
//       receiver: toAddress,
//     },
//   }
// }

export interface MsgConvertIbcTransferERC20Params
  extends MessageIBCMsgTransfer {
  contractAddress: string
  destinationAddress: string
  amount: string
}

export function createMessageConvertIbcTransferERC20(
  chain: Chain,
  sender: Sender,
  ethAddress: string,
  fee: Fee,
  memo: string,
  params: MsgConvertIbcTransferERC20Params,
) {
  // EIP712
  // const feeObject = generateFee(
  //   fee.amount,
  //   fee.denom,
  //   fee.gas,
  //   sender.accountAddress,
  // )
  // const types = generateTypes(MSG_CONVERT_IBC_TRANSFER_ERC20_TYPES)

  // const msgConvertERC20 = createMsgConvertERC20(
  //   params.contractAddress,
  //   params.amount,
  //   sender.accountAddress,
  //   params.destinationAddress,
  // )

  // const msgTransferIbc = createIBCMsgTransfer(
  //   params.receiver,
  //   sender.accountAddress,
  //   params.sourceChannel,
  //   params.sourcePort,
  //   params.revisionHeight,
  //   params.revisionNumber,
  //   params.timeoutTimestamp,
  //   params.amount,
  //   params.denom,
  // )

  // const messages = generateMessageWithMultipleTransactions(
  //   sender.accountNumber.toString(),
  //   sender.sequence.toString(),
  //   chain.cosmosChainId,
  //   memo,
  //   feeObject,
  //   [msgConvertERC20, msgTransferIbc],
  // )

  // const eipToSign = createEIP712(types, chain.chainId, messages)

  // Cosmos
  const cosmosMsgConvertERC20 = {
    message: new evmos.erc20.v1.MsgConvertERC20({
      contract_address: params.contractAddress,
      amount: params.amount,
      sender: ethAddress,
      receiver: params.destinationAddress,
    }),
    path: 'evmos.erc20.v1.MsgConvertERC20',
  }

  const cosmosMsgIbcTransfer = protoCreateIBCMsgTransfer(
    params.sourcePort,
    params.sourceChannel,
    params.amount,
    params.denom,
    sender.accountAddress,
    params.receiver,
    params.revisionNumber,
    params.revisionHeight,
    params.timeoutTimestamp,
  )

  const tx = createTransactionWithMultipleMessages(
    [cosmosMsgConvertERC20, cosmosMsgIbcTransfer],
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
    eipToSign: {},
  }
}
