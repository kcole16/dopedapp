import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../actions/index'
import {browserHistory} from 'react-router'
import moment from 'moment'
import numeral from 'numeral'

export default class Messages extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {user, actions} = this.props
  }

  render() {
    const { messages } = this.props
    const messageRows = messages.map((message, index) => {
      if (message.message && index > 0) {
        return (
            <tr key={index} >
              <td>{message.by.email}</td>
              <td>{message.message.text}</td>
            </tr>
          )
      }
    })
    return (
      <table className="table">
        <thead>
          <tr>
            <th>From</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {messageRows}
        </tbody>
      </table>
    )
  }
}
