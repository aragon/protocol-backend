import Network from '../web3/Network'
import ErrorActions from './errors'
import ProtocolActions from './protocol'
import AccountActions from './accounts'
import * as ActionTypes from '../actions/types'
import { fromWei } from 'web3-utils'

const FaucetActions = {
  find() {
    return async function(dispatch) {
      try {
        const protocolAddress = await ProtocolActions.findProtocolAddress()
        if (await Network.isProtocolAt(protocolAddress)) {
          if (await Network.isFaucetAvailable()) {
            const faucet = await Network.getFaucet()
            if (faucet) {
              dispatch(FaucetActions.receiveFaucet(faucet.address))
              dispatch(FaucetActions.updateAntBalance(faucet, protocolAddress))
              dispatch(FaucetActions.updateFeeBalance(faucet, protocolAddress))
            }
          }
        }
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateAntBalance(faucet, protocolAddress) {
    return async function(dispatch) {
      try {
        const protocol = await Network.getProtocol(protocolAddress)
        const ant = await protocol.token()
        const symbol = await ant.symbol()
        const antBalance = await faucet.getTotalSupply(ant.address)
        const { period, amount } = await faucet.getQuota(ant.address)
        const quota = fromWei(amount.toString())
        const balance = fromWei(antBalance.toString())
        dispatch(FaucetActions.receiveAntBalance({ symbol, balance, address: ant.address, period, quota }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateFeeBalance(faucet, protocolAddress) {
    return async function(dispatch) {
      try {
        const protocol = await Network.getProtocol(protocolAddress)
        const feeToken = await protocol.feeToken()
        const symbol = await feeToken.symbol()
        const feeBalance = await faucet.getTotalSupply(feeToken.address)
        const { period, amount } = await faucet.getQuota(feeToken.address)
        const quota = fromWei(amount.toString())
        const balance = fromWei(feeBalance.toString())
        dispatch(FaucetActions.receiveFeeBalance({ symbol, balance, address: feeToken.address, period, quota }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  claim(token) {
    return async function(dispatch) {
      try {
        const faucet = await Network.getFaucet()
        const { amount } = await faucet.getQuota(token)
        await faucet.withdraw(token, amount)
        dispatch(FaucetActions.find())
        dispatch(AccountActions.findCurrent())
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveFaucet(address) {
    return { type: ActionTypes.RECEIVE_FAUCET, address }
  },

  receiveAntBalance({ symbol, balance, address, period, quota }) {
    return { type: ActionTypes.RECEIVE_FAUCET_ANT_BALANCE, symbol, balance, address, period, quota }
  },

  receiveFeeBalance({ symbol, balance, address, period, quota }) {
    return { type: ActionTypes.RECEIVE_FAUCET_FEE_BALANCE, symbol, balance, address, period, quota }
  },
}

export default FaucetActions
