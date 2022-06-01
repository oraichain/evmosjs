import { createMsgConvertCoin } from '../../src/messages/msgConvertCoin'

describe('msgConvertCoin tests', () => {
  it('create message convert coin', async () => {
    const message = createMsgConvertCoin(
      'oraie183wxk4cvrkjxn69jfghga5euy79a5v3zsh204g',
      '0x7482543Fc2BB9b78Cd8e2479bB642d4C20220735',
      '69420',
      'aphoton',
    )
    const expectedObject = {
      sender: 'oraie183wxk4cvrkjxn69jfghga5euy79a5v3zsh204g',
      receiver: '0x7482543Fc2BB9b78Cd8e2479bB642d4C20220735',
      coin:
      {
        denom: 'aphoton',
        amount: '69420',
      },

    }

    expect(message.message.toObject()).toStrictEqual(expectedObject)
    expect(message.path).toBe('evmos.erc20.v1.MsgConvertCoin')
  })
})
