import React from 'react'
import Protocol from '../protocol/Protocol.react'
import AccountBalances from '../account/AccountBalances.react'

export default class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <Protocol/>
        <AccountBalances/>
      </div>
    )
  }
}
