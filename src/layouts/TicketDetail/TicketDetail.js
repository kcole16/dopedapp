import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../actions/index'
import Messages from './components/Messages'
import MessageModal from '../../components/MessageModal'
import CreateArticleModal from '../../components/CreateArticleModal'
import Modal from 'react-modal'

const closeStatuses = ['requested', 'in_negotiation']
const acceptStatuses = ['in_negotiation']
const approveStatuses = ['completed']
const disputeStatuses = ['completed']

const acceptJobStatuses = ['requested']
const requestStatuses = ['requested','accepted']
const completeStatuses = ['accepted', 'claimed']

class TicketDetail extends Component {
  constructor(props) {
    super(props)
    this.requestIncrease = this.requestIncrease.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.changeContractStatus = this.changeContractStatus.bind(this)
    this.closeTicket = this.closeTicket.bind(this)
    this.state = {
      ticket: null,
      modalIsOpen: false,
      messageModalIsOpen: false,
      articleModalIsOpen: false,
      priceRequested: null
    }
  }

  componentWillMount() {
    const {tickets, actions} = this.props
    const id = this.props.location.query.id
    const ticketsList = tickets.tickets
    const ticket = ticketsList.find((ticket) => parseInt(ticket.id) === parseInt(id))
    actions.fetchTicketDetail(ticket.id)
    this.setState({ticket: ticket})
  }

  requestIncrease() {
    const {user, actions} = this.props;
    const priceRequested = this.state.priceRequested
    if (priceRequested) {
      const ticket = this.state.ticket
      ticket.requestedPrice = priceRequested
      actions.fetchAcceptIncrease(user.address, ticket)
      this.setState({modalIsOpen: false, priceRequested: null})
    } else {
      this.setState({modalIsOpen: true})
    }
  }

  sendMessage(message) {
    const {user, actions} = this.props
    actions.fetchSendMessage(message, this.state.ticket.id, user.address)
    this.setState({messageModalIsOpen: false})
  }

  changeContractStatus(ticket, status) {
    const {user, actions} = this.props
    ticket.status = status
    actions.fetchChangeContractStatus(ticket, user.address)
  }

  closeTicket(ticket) {
    const {user, actions} = this.props
    actions.fetchCloseTicket(ticket, user.address)
  }

  render() {
    const {user, actions, tickets} = this.props
    const ticket = this.state.ticket
    const status = ticket.status
    const isUser = <div className="row">
                    <button 
                      className="btn btn-md btn-secondary" 
                      onClick={() => this.setState({messageModalIsOpen:true})}>Send Message</button>
                    { closeStatuses.indexOf(status) > -1  && ticket.userAddress === user.address ? <button className="btn btn-md btn-danger" onClick={() => this.closeTicket(ticket)}>Close Ticket</button> : null }
                    { closeStatuses.indexOf(status) > -1  && ticket.userAddress !== user.address ? <button className="btn btn-md btn-success" onClick={() => actions.fetchClaimTicket(user.address, ticket)}>Flag Ticket</button> : null }
                    { status === 'claimed'  && ticket.userAddress !== user.address ? <button className="btn btn-md btn-danger" onClick={() => actions.fetchClaimTicket(user.address, ticket)}>Unflag Ticket</button> : null }
                    { acceptStatuses.indexOf(status) > -1 ? <button className="btn btn-md btn-warning" onClick={() => actions.fetchAcceptIncrease(user.address, ticket)}>Accept Price</button> : null }
                    { closeStatuses.indexOf(status) > -1 ? <button className="btn btn-md btn-warning" onClick={() => this.setState({modalIsOpen: true})}>Add to Bounty</button> : null }
                    { completeStatuses.indexOf(status) > -1 && ticket.providerAddress === user.address ? <button className="btn btn-primary" onClick={() => this.setState({articleModalIsOpen: true})}>Add Article</button> : null}
                    { status === 'approved' && ticket.providerAddress === user.address ? <button className="btn btn-md btn-success" onClick={() => actions.fetchWithdrawPayment(user.address, ticket)}>Withdraw Payment</button> : null }
                   </div>
    const isProvider = <div className="row">
                        <button 
                          className="btn btn-md btn-secondary" 
                          onClick={() => this.setState({messageModalIsOpen:true})}>Send Message</button>
                    { approveStatuses.indexOf(status) > -1 ? <button className="btn btn-md btn-success" onClick={() => actions.fetchApproveSolution(user.address, ticket)}>Approve Article</button> : null }
                    { disputeStatuses.indexOf(status) > -1 ? <button className="btn btn-md btn-danger" onClick={() => actions.fetchChangeStatus(ticket.id, 'disputed', user.address)}>Reject Article</button> : null }
                       </div>
    return(
      <main className="container">
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.setState({modalIsOpen: false, priceRequested: null})}
          style={modalStyle}
          contentLabel="Modal">
          <form>
            <div className="form-group">
              <label htmlFor="priceRequested">Amount to Add (ETH)</label>
              <input 
                type="text" 
                className="form-control" 
                name="priceRequested" 
                id="priceRequested" 
                placeholder="" 
                value={this.state.priceRequested}
                onChange={(e) => this.setState({priceRequested: e.target.value})}/>
            </div>
          </form>
          <button className="btn btn-primary" onClick={this.requestIncrease}>Contribute</button>
        </Modal>
        <MessageModal
          modalIsOpen={this.state.messageModalIsOpen}
          closeModal={() => this.setState({messageModalIsOpen: false})} 
          sendMessage={this.sendMessage}/>
        <CreateArticleModal
          user={user}
          actions={actions}
          ticket={ticket}
          modalIsOpen={this.state.articleModalIsOpen}
          closeModal={() => this.setState({articleModalIsOpen: false})} />
        <div className="row">
          <div className="col">
            { ticket.status === 'in_negotiation' 
              ? <h6 style={{color: 'red'}}>Requested price increase to { ticket.requestedPrice } ETH</h6>
              : null }
            <h3>{ticket.subject}</h3>
            { user.type === 'user' 
              ? isUser
              : isProvider }
            <label style={{marginTop: 10}}>Flagged By: {ticket.providerAddress}</label><br></br>
            <label style={{marginTop: 10}}>Price: {ticket.price} ETH</label><br></br>
            <label style={{marginTop: 10}}>Issue Description</label>
            <div className="issue-description">
              <p>{ticket.text}</p>
            </div>
          </div>
          <div className="col" style={{marginTop: 10}}>
            <h6>Messages</h6>
            <Messages messages={tickets.ticket ? tickets.ticket.updates : []} />
          </div>
        </div>
        { ticket.article ? <div>
                              <h5 style={{marginTop: 10}}>Pending Article</h5>
                              <button className="btn btn-primary" onClick={() => actions.fetchArticle(ticket.article.id, true)}>Review Article</button>
                            </div> : null }
      </main>
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
)(TicketDetail)

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

