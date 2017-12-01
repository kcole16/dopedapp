import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions/index'
import Modal from 'react-modal'
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class CreateTicketModal extends Component {
  constructor(props) {
    super(props)
    this.updateForm = this.updateForm.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.submitTicket = this.submitTicket.bind(this)
    this.state = {
      subject: '',
      text: '',
      price: '',
      dueDate: moment()
    }
  }

  updateForm(e) {
    const state = this.state
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  handleDateChange(date) {
    this.setState({
      dueDate: date
    });
  }

  submitTicket() {
    const {user, actions, closeModal} = this.props
    const ticket = {
      userAddress: user.data.address,
      subject: this.state.subject,
      text: this.state.text,
      price: this.state.price,
      dateDue: moment(this.state.dateDue).format('DD MMM YY')
    }
    actions.fetchCreateTicket(ticket)
    this.setState({subject: '', text: '', price: 0})
    closeModal()
  }

  render() {
    const {modalIsOpen, closeModal} = this.props
    return (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={modalStyle}
          contentLabel="Modal">
          <h4>Request an Article</h4>
          <form>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input 
                type="text" 
                className="form-control" 
                name="subject" 
                id="subject" 
                placeholder="Enter Subject" 
                value={this.state.subject}
                onChange={this.updateForm}/>
            </div>
            <div className="form-group">
              <label htmlFor="text">Details</label>
              <textarea 
                className="form-control" 
                name="text" 
                id="text" 
                placeholder="Enter Details"
                value={this.state.text}
                onChange={this.updateForm}/>
            </div>
            <div className="form-group">
              <label htmlFor="text">Bounty (ETH)</label>
              <input 
                type="number"
                className="form-control" 
                name="price" 
                id="text" 
                placeholder="ETH"
                value={this.state.price}
                onChange={this.updateForm}/>
            </div>
          </form>
          <button className="btn btn-primary" onClick={this.submitTicket}>Submit Request</button>
        </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
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
)(CreateTicketModal)


const modalStyle = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(56, 56, 56, 0.75)'
  },
  content : {
    position                   : 'absolute',
    top                        : '100px',
    left                       : '300px',
    right                      : '300px',
    bottom                     : '100px',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'

  }
}
