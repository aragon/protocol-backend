import Network from '../web3/Network'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const PaymentsBookActions = {
  findPeriod(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          paymentPeriod (id: "${id}") {
            id
            balanceCheckpoint
            totalActiveBalance
            payments {
              payer
              sender
              amount
              token { 
                id
                name
                symbol
              }
              data
              createdAt
            }
            guardiansShares {
              amount
              token { 
                id
                name
                symbol
              }
            }
          }
        }`)

        const { paymentPeriod: period } = result
        dispatch(PaymentsBookActions.receivePeriod(period))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAllPeriods() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          paymentPeriods (orderBy: createdAt, orderDirection: desc) {
            id
            balanceCheckpoint
            totalActiveBalance
            createdAt
          }
        }`)

        const { paymentPeriods: periods } = result
        dispatch(PaymentsBookActions.receiveAllPeriods(periods))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveAllPeriods(list) {
    return { type: ActionTypes.RECEIVE_PAYMENT_PERIODS, list }
  },

  receivePeriod(period) {
    return { type: ActionTypes.RECEIVE_PAYMENT_PERIOD, period }
  },
}

export default PaymentsBookActions
