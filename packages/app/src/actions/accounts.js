import Network from '../web3/Network'
import ErrorActions from './errors'
import ProtocolActions from './protocol'
import * as ActionTypes from '../actions/types'
import { fromWei } from 'web3-utils'

const AccountActions = {
  findCurrent() {
    return async function(dispatch) {
      try {
        const enabled = await Network.isEnabled()
        dispatch(AccountActions.receiveEnabled(enabled))

        if (enabled) {
          const account = await Network.getAccount()
          const protocolAddress = await ProtocolActions.findProtocolAddress()
          dispatch(AccountActions.receive(account))
          dispatch(AccountActions.updateEthBalance(account))

          if (await Network.isProtocolAt(protocolAddress)) {
            dispatch(AccountActions.updateAntBalance(account, protocolAddress))
            dispatch(AccountActions.updateFeeBalance(account, protocolAddress))
          } else {
            dispatch(ErrorActions.show(new Error(`Could not find Protocol at ${protocolAddress}, please make sure you're in the right network`)))
          }
        }
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateEthBalance(account) {
    return async function(dispatch) {
      try {
        const ethBalance = await Network.getBalance(account)
        const balance = fromWei(ethBalance.toString())
        dispatch(AccountActions.receiveEthBalance({ symbol: 'ETH', balance }))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateAntBalance(account, protocolAddress) {
    return async function(dispatch) {
      try {
        const protocol = await Network.getProtocol(protocolAddress)
        const ant = await protocol.token()
        const symbol = await ant.symbol()
        const antBalance = await ant.balanceOf(account)
        const balance = fromWei(antBalance.toString())
        dispatch(AccountActions.receiveAntBalance({ symbol, balance, address: ant.address }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  updateFeeBalance(account, protocolAddress) {
    return async function(dispatch) {
      try {
        const protocol = await Network.getProtocol(protocolAddress)
        const feeToken = await protocol.feeToken()
        const symbol = await feeToken.symbol()
        const feeBalance = await feeToken.balanceOf(account)
        const balance = fromWei(feeBalance.toString())
        dispatch(AccountActions.receiveFeeBalance({ symbol, balance, address: feeToken.address }))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receive(address) {
    return { type: ActionTypes.RECEIVE_ACCOUNT, address }
  },

  receiveEnabled(enabled) {
    return { type: ActionTypes.RECEIVE_WEB3_ENABLED, enabled }
  },

  receiveEthBalance({ symbol, balance }) {
    return { type: ActionTypes.RECEIVE_ETH_BALANCE, symbol, balance }
  },

  receiveAntBalance({ symbol, balance, address }) {
    return { type: ActionTypes.RECEIVE_ANT_BALANCE, symbol, balance, address }
  },

  receiveFeeBalance({ symbol, balance, address }) {
    return { type: ActionTypes.RECEIVE_FEE_BALANCE, symbol, balance, address }
  },
}

export default AccountActions
