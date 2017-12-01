import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions/index'
import Modal from 'react-modal'
import Editor from './Editor'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html';

class CreateArticleModal extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.submitArticle = this.submitArticle.bind(this)
    this.state = {
      title: '',
      editorState: EditorState.createEmpty()
    }
  }

  handleChange(editorState) {
    this.setState({editorState: editorState})
  }

  submitArticle() {
    const {user, ticket, actions, closeModal} = this.props
    const rawContentState = convertToRaw(this.state.editorState.getCurrentContent())
    const markup = draftToHtml(
      rawContentState
    )
    actions.fetchCreateArticle(this.state.title, markup, ticket.id, user.data.address)
    this.setState({title: '', editorState: EditorState.createEmpty()})
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
          <h4>Submit New Article</h4>
          <form>
            <div className="form-group">
              <label htmlFor="subject">Title</label>
              <input 
                type="text" 
                className="form-control" 
                name="subject" 
                id="subject" 
                placeholder="Enter Subject" 
                value={this.state.title}
                onChange={(e) => this.setState({title: e.target.value})}/>
            </div>
          </form>
          <Editor editorState={this.state.editorState} handleChange={this.handleChange} /><br></br>
          <button className="btn btn-primary" onClick={this.submitArticle}>Submit Article</button>
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
)(CreateArticleModal)


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
