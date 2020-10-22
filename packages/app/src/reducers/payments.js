import * as ActionTypes from '../actions/types'

const initialState = { module: null, subscribers: [], periods: [], period: {} }

const PaymentsBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_PAYMENTS_BOOK_MODULE:
      return Object.assign({}, state, { module: action.module })
    case ActionTypes.RECEIVE_PAYMENT_PERIOD:
      return Object.assign({}, state, { period: action.period })
    case ActionTypes.RECEIVE_PAYMENT_PERIODS:
      return Object.assign({}, state, { periods: action.list })
    case ActionTypes.RECEIVE_SUBSCRIBERS:
      return Object.assign({}, state, { subscribers: action.list })
    default:
      return state
  }
}

export default PaymentsBookReducer
