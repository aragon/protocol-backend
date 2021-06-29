import * as ActionTypes from '../actions/types'

const initialState = { court: {} }

const CourtReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_COURT:
      return Object.assign({}, state, { court: action.court })
    default:
      return state
  }
}

export default CourtReducer
