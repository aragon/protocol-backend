import * as ActionTypes from '../actions/types'

const initialState = { protocol: {} }

const ProtocolReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_PROTOCOL:
      return Object.assign({}, state, { protocol: action.protocol })
    default:
      return state
  }
}

export default ProtocolReducer
