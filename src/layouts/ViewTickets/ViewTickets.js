import React, { Component } from 'react'
import CreateTicketModal from '../../components/CreateTicketModal'
import Tickets from './components/Tickets'

class ViewTickets extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.state = {
      modalIsOpen: false,
      userType: authData.authData.type
    }
  }

  render() {
    const authData = this.props
    return(
      <main className="container">
        <CreateTicketModal
          modalIsOpen={this.state.modalIsOpen}
          closeModal={() => this.setState({modalIsOpen: false})}
          submitTicket={() => console.log("submitted")}/>
        <div className="row" style={{marginLeft: 10, paddingBottom: 10}}>
          <h3 style={{marginRight: 10}}>Requested Articles</h3>
          {this.state.userType === 'user' 
            ? <button 
              className="btn btn-main" 
              onClick={() => this.setState({modalIsOpen: true})}>New Request</button>
            : null
          }
          <Tickets />
        </div>
      </main>
    )
  }
}

export default ViewTickets
