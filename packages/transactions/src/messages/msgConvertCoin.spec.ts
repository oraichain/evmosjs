import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing/build'
import { stringToPath } from '@cosmjs/crypto'
import { StargateClient } from '@cosmjs/stargate'
import { createTxRaw } from '@tharsis/proto'
import Long from 'long'
import Cosmos from '@oraichain/cosmosjs'
import { createMessageConvertCoin } from './msgConvertCoin'

describe('msgConvertCoin tests', () => {
  it('valid', async () => {
    const cosmos = new Cosmos('http://167.172.151.137:1317', 'kawaii_6886-1')
    cosmos.setBech32MainPrefix('oraie')
    cosmos.path = "m/44'/118'/0'/0/0"
    const childKey = cosmos.getChildKey(
      'orange find liar team unknown fish floor swamp repair firm tribe announce basic pluck giant same armor dumb sugar coyote spice rain cable harbor',
    )
    const address = cosmos.getAddress(childKey)
    console.log('address: ', address)

    const chain = {
      chainId: 6886,
      cosmosChainId: 'kawaii_6886-1',
    }

    const sender = {
      accountAddress: 'oraie14n3tx8s5ftzhlxvq0w5962v60vd82h30v78q92',
      sequence: 8,
      accountNumber: 17,
      pubkey: 'AipQCudhlHpWnHjSgVKZ+SoSicvjH7Mp5gCFyDdlnQtn',
    }

    const fee = {
      amount: '0',
      denom: 'oraie',
      gas: '2000000',
    }

    const memo = ''

    const params = {
      destinationAddress: '0x7482543Fc2BB9b78Cd8e2479bB642d4C20220735',
      amount: '1',
      denom:
        'ibc/E8734BEF4ECF225B71825BC74DE30DCFF3644EAC9778FFD4EF9F94369B6C8377',
    }

    const msg = createMessageConvertCoin(chain, sender, fee, memo, params)

    const bodyBytes = msg.signDirect.body.serialize()
    const authInfoBytes = msg.signDirect.authInfo.serialize()

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      'orange find liar team unknown fish floor swamp repair firm tribe announce basic pluck giant same armor dumb sugar coyote spice rain cable harbor',
      {
        hdPaths: [stringToPath("m/44'/60'/0'/0/0")],
        prefix: 'oraie',
      },
    )
    console.log('FOO BAR')

    const accs = await wallet.getAccounts()

    console.log('accs: ', accs)

    // const signedTx = await cosmos.sign(childKey, bodyBytes, authInfoBytes, 17, 'oraie14n3tx8s5ftzhlxvq0w5962v60vd82h30v78q92');

    const result = await wallet.signDirect(
      'oraie14n3tx8s5ftzhlxvq0w5962v60vd82h30v78q92',
      {
        bodyBytes,
        authInfoBytes,
        chainId: 'kawaii_6886-1',
        accountNumber: new Long(17),
      },
    )
    const signature = Buffer.from(result.signature.signature, 'base64')
    const txRaw = createTxRaw(bodyBytes, authInfoBytes, [
      signature,
    ]).message.serialize()

    const client = await StargateClient.connect('http://167.172.151.137:26657')
    const txResult = await client.broadcastTx(txRaw)
    console.log('tx result: ', txResult)

    // expect(
    //   Buffer.from(msg.legacyAmino.body.serializeBinary()).toString('base64'),
    // ).toBe(
    //   'CogBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmgKK2V0aG0xdGZlZ2Y1MG41eGwwaGQ1Y3hmempjYTN5bHNmcGcwZm5lZDVncW0SLGV2bW9zMXBtazJyMzJzc3F3cHM0MnkzYzlkNGNscWxjYTQwM3lkOXd5bWdyGgsKBmFldm1vcxIBMQ==',
    // )
    // expect(
    //   Buffer.from(msg.legacyAmino.authInfo.serializeBinary()).toString(
    //     'base64',
    //   ),
    // ).toBe(
    //   'ClkKTwooL2V0aGVybWludC5jcnlwdG8udjEuZXRoc2VjcDI1NmsxLlB1YktleRIjCiECBPD7i/R1oivGw1JbgVxD4iiKeA+x4XAc7UOeyzKg6pkSBAoCCH8YARISCgwKBmFldm1vcxICMjAQwJoM',
    // )
    // expect(msg.legacyAmino.signBytes).toBe(
    //   '2XbbRbgd5cQ05gDxc1xxKAH++HXulj5JSrwLI51R0ss=',
    // )

    // expect(
    //   Buffer.from(msg.signDirect.body.serializeBinary()).toString('base64'),
    // ).toBe(
    //   'CogBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmgKK2V0aG0xdGZlZ2Y1MG41eGwwaGQ1Y3hmempjYTN5bHNmcGcwZm5lZDVncW0SLGV2bW9zMXBtazJyMzJzc3F3cHM0MnkzYzlkNGNscWxjYTQwM3lkOXd5bWdyGgsKBmFldm1vcxIBMQ==',
    // )
    // expect(
    //   Buffer.from(msg.signDirect.authInfo.serializeBinary()).toString('base64'),
    // ).toBe(
    //   'ClkKTwooL2V0aGVybWludC5jcnlwdG8udjEuZXRoc2VjcDI1NmsxLlB1YktleRIjCiECBPD7i/R1oivGw1JbgVxD4iiKeA+x4XAc7UOeyzKg6pkSBAoCCAEYARISCgwKBmFldm1vcxICMjAQwJoM',
    // )
    // expect(msg.signDirect.signBytes).toBe(
    //   'gmgo2KWJ6FwXEH69W0xMGtrmjUMU182nxn9B3vUw2iI=',
    // )

    // expect(msg.eipToSign).toStrictEqual({
    //   domain: {
    //     chainId: 9000,
    //     name: 'Cosmos Web3',
    //     salt: '0',
    //     verifyingContract: 'cosmos',
    //     version: '1.0.0',
    //   },
    //   message: {
    //     account_number: '9',
    //     chain_id: 'evmos_9000-1',
    //     fee: {
    //       amount: [{ amount: '20', denom: 'aevmos' }],
    //       feePayer: 'ethm1tfegf50n5xl0hd5cxfzjca3ylsfpg0fned5gqm',
    //       gas: '200000',
    //     },
    //     memo: '',
    //     msgs: [
    //       {
    //         type: 'cosmos-sdk/MsgSend',
    //         value: {
    //           amount: [{ amount: '1', denom: 'aevmos' }],
    //           from_address: 'ethm1tfegf50n5xl0hd5cxfzjca3ylsfpg0fned5gqm',
    //           to_address: 'evmos1pmk2r32ssqwps42y3c9d4clqlca403yd9wymgr',
    //         },
    //       },
    //     ],
    //     sequence: '1',
    //   },
    //   primaryType: 'Tx',
    //   types: {
    //     Coin: [
    //       { name: 'denom', type: 'string' },
    //       { name: 'amount', type: 'string' },
    //     ],
    //     EIP712Domain: [
    //       { name: 'name', type: 'string' },
    //       { name: 'version', type: 'string' },
    //       { name: 'chainId', type: 'uint256' },
    //       { name: 'verifyingContract', type: 'string' },
    //       { name: 'salt', type: 'string' },
    //     ],
    //     Fee: [
    //       { name: 'feePayer', type: 'string' },
    //       { name: 'amount', type: 'Coin[]' },
    //       { name: 'gas', type: 'string' },
    //     ],
    //     Msg: [
    //       { name: 'type', type: 'string' },
    //       { name: 'value', type: 'MsgValue' },
    //     ],
    //     MsgValue: [
    //       { name: 'from_address', type: 'string' },
    //       { name: 'to_address', type: 'string' },
    //       { name: 'amount', type: 'TypeAmount[]' },
    //     ],
    //     Tx: [
    //       { name: 'account_number', type: 'string' },
    //       { name: 'chain_id', type: 'string' },
    //       { name: 'fee', type: 'Fee' },
    //       { name: 'memo', type: 'string' },
    //       { name: 'msgs', type: 'Msg[]' },
    //       { name: 'sequence', type: 'string' },
    //     ],
    //     TypeAmount: [
    //       { name: 'denom', type: 'string' },
    //       { name: 'amount', type: 'string' },
    //     ],
    //   },
    // })
  })
})
