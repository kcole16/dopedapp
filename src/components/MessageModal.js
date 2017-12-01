import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions/index'
import Modal from 'react-modal'
import DatePicker from 'react-datepicker';
import moment from 'moment';


export default class MessageModal extends Component {
  constructor(props) {
    super(props)
    this.updateForm = this.updateForm.bind(this)
    this.submitMessage = this.submitMessage.bind(this)
    this.state = {
      text: ''
    }
  }

  updateForm(e) {
    const state = this.state
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  submitMessage() {
    const {sendMessage} = this.props
    sendMessage(this.state.text)
  }

  render() {
    const {modalIsOpen, closeModal} = this.props
    return (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={modalStyle}
          contentLabel="Modal">
          <h4>New Message</h4>
          <form>
            <div className="form-group">
              <label htmlFor="text">Message</label>
              <textarea 
                className="form-control" 
                name="text" 
                id="text" 
                value={this.state.text}
                onChange={this.updateForm}/>
            </div>
          </form>
          <button className="btn btn-primary" onClick={this.submitMessage}>Submit Message</button>
        </Modal>
    )
  }
}


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
