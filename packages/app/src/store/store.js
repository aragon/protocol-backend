import thunkMiddleware from 'redux-thunk'
import error from '../reducers/errors'
import account from '../reducers/accounts'
import faucet from '../reducers/faucet'
import fetching from '../reducers/fetching'
import anj from '../reducers/anj'
import court from '../reducers/court'
import guardians from '../reducers/guardians'
import drafts from '../reducers/drafts'
import disputes from '../reducers/disputes'
import subscriptions from '../reducers/subscriptions'
import admin from '../reducers/admin'
import emails from '../reducers/emails'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const mainReducer = combineReducers({
  error,
  account,
  faucet,
  fetching,
  anj,
  court,
  guardians,
  drafts,
  disputes,
  subscriptions,
  admin,
  emails,
})

const Store = createStore(
  mainReducer,
  applyMiddleware(thunkMiddleware)
)

export default Store
