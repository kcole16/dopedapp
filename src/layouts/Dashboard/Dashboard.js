import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../actions/index'
import SearchBar from '../../components/SearchBar'
import CreateTicketModal from '../../components/CreateTicketModal'
import CreateArticleModal from '../../components/CreateArticleModal'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      articleModalIsOpen: false
    }
  }

  render() {
    const {user, actions} = this.props
    return(
      <main className="container">
        <CreateTicketModal
          modalIsOpen={this.state.modalIsOpen}
          closeModal={() => this.setState({modalIsOpen: false})}
          submitTicket={() => console.log("submitted")}/>
        <CreateArticleModal
          user={user}
          actions={actions}
          ticket={{id: null}}
          modalIsOpen={this.state.articleModalIsOpen}
          closeModal={() => this.setState({articleModalIsOpen: false})} />
        <div className="row">
          <div className="col">
            <h3>Search Knowledge Base</h3>
            <SearchBar />
          </div>
          {user.type === 'user'
          ? <div className="col">
              <h5>Can't find what you're looking for? <button onClick={() => this.setState({modalIsOpen: true})} className="btn btn-main">Request an Article</button> or <button style={{marginLeft: 0}} onClick={() => this.setState({articleModalIsOpen: true})} className="btn btn-primary">Add an Article</button> 
              </h5>
            </div> : null }
        </div>
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
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
)(Dashboard)
