import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../actions/index'
import {browserHistory} from 'react-router'
import moment from 'moment'
import numeral from 'numeral'

class Tickets extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {user, actions} = this.props
    actions.fetchTickets(user.address)
  }

  render() {
    const {tickets} = this.props
    const ticketRows = tickets.tickets.map((ticket, index) => {
      return (
          <tr key={index} >
            <td>
              <div className="row">
                <i className="up"></i>
              </div>
              <div className="row">
                <i className="down"></i>
              </div>
            </td>
            <td>{ticket.subject}</td>
            <td>{ticket.text}</td>
            <td>{ticket.status !== 'claimed' ? ticket.status : 'flagged'}</td>
            <td>{ticket.price} ETH</td>
            <td>
              <button 
                className="btn btn-secondary btn-sm"
                style={{marginLeft: 0}} 
                onClick={() => browserHistory.push('/ticket?id='+ticket.id)}>View Request</button>
            </td>
          </tr>
        )
    })
    return (
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Subject</th>
            <th>Details</th>
            <th>Status</th>
            <th>Bounty</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {ticketRows}
        </tbody>
      </table>
    )
  }
}

function mapStateToProps(state) {
  return {
    tickets: state.tickets,
    user: state.user.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tickets)