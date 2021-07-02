import React from 'react'
import Store from '../../store/store'
import { Link } from 'react-router-dom'
import PaymentsBookActions from '../../actions/payments'

export default class PeriodsList extends React.Component {
  constructor(props){
    super(props)
    this.state = { periods: null }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(PaymentsBookActions.findAllPeriods())
  }

  render() {
    const { periods } = this.state
    return (
      <div ref="periodsList">
        <h3>Payments Periods</h3>
        { (!periods) ? <em>Loading...</em> : periods.length === 0 ?
          <em>None</em> :
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Balance checkpoint</th>
                <th>Total active balance</th>
              </tr>
            </thead>
            <tbody>
              {this._buildList()}
            </tbody>
          </table>
        }
      </div>
    )
  }

  _buildList() {
    return this.state.periods.map((period, index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/period/${period.id}`}>
              <b>#{period.id}</b>
            </Link>
          </td>
          <td>{period.balanceCheckpoint}</td>
          <td>{period.totalActiveBalance}</td>
        </tr>
      )
    })
  }

  _onChange() {
    if(this.refs.periodsList) {
      const { periods } = Store.getState().payments
      this.setState({ periods })
    }
  }
}
