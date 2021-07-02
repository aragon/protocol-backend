import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import { toDate } from '../../helpers/toDate'
import { fromWei } from 'web3-utils'
import GuardiansActions from '../../actions/guardians'

export default class GuardianDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = { address: this.props.match.params.address, guardian: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(GuardiansActions.find(this.state.address))
  }

  render() {
    const { address, guardian } = this.state
    return (
      <div ref="guardianDetail">
        <h3>Guardian #{address}</h3>
          { !guardian.id ? 'Loading...' :
            <div>
              <p>Id: {guardian.treeId}</p>
              <p>Active balance: {fromWei(guardian.activeBalance)}</p>
              <p>Locked balance: {fromWei(guardian.lockedBalance)}</p>
              <p>Staked balance: {fromWei(guardian.availableBalance)}</p>
              <p>Deactivating balance: {fromWei(guardian.deactivationBalance)}</p>
              <p>Withdrawals lock term ID: {guardian.withdrawalsLockTermId}</p>
              <p>Created at: {toDate(guardian.createdAt)}</p>
              <p>See <Link to={`/guardians/${address}/drafts`}>drafts</Link></p>
              <p>See <Link to={`/guardians/${address}/staking`}>staking</Link></p>
              <p>See <Link to={`/guardians/${address}/accounting`}>accounting</Link></p>
            </div>
          }
      </div>
    )
  }

  _onChange() {
    if(this.refs.guardianDetail) {
      const { current } = Store.getState().guardians
      this.setState({ guardian: current })
    }
  }
}
