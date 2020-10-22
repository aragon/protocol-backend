import { fromWei } from 'web3-utils'
import React from 'react'
import Store from '../../store/store'
import PaymentsBookActions from '../../actions/payments'

export default class PeriodDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = { id: this.props.match.params.id, period: { } }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(PaymentsBookActions.findPeriod(this.state.id))
  }

  render() {
    const { id, period } = this.state
    return (
      <div ref="periodDetail">
        <h3>Payment Period #{id}</h3>
          { !period.id ? 'Loading...' :
            <div>
              <p>Balance checkpoint: {period.balanceCheckpoint}</p>
              <p>Total active balance: {period.totalActiveBalance}</p>
              <p>Payments: {this.state.period.payments.length === 0 && 'None'}</p>
              <ul>{this._buildPaymentsList()}</ul>
              <p>Guardians shares: {this.state.period.guardiansShares.length === 0 && 'None'}</p>
              <ul>{this._buildGuardiansSharesList()}</ul>
            </div>
          }
      </div>
    )
  }

  _buildPaymentsList() {
    return this.state.period.payments.map((payment, index) =>
      <li key={index}>
        Payment #{payment.id}
        <ul>
          <li>Payer: {payment.guardian.id}</li>
          <li>Sender: {payment.guardian.id}</li>
          <li>Token: {payment.token.id}</li>
          <li>Amount: {fromWei(payment.amount)} {payment.token.symbol}</li>
          <li>Data: {payment.data ? payment.data : '(null)'}</li>
          <li>Created at: {payment.createdAt}</li>
        </ul>
      </li>
    )
  }

  _buildGuardiansSharesList() {
    return this.state.period.guardiansShares.map((share, index) =>
      <li key={index}>{fromWei(share.amount)} {share.token.symbol} ({share.token.id})</li>
    )
  }

  _onChange() {
    if(this.refs.periodDetail) {
      const { period } = Store.getState().payments
      this.setState({ period })
    }
  }
}
