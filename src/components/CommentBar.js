import React, { Component } from 'react'

export default class CommentBar extends Component {
  constructor(props) {
    super(props)
    this.addComment = this.addComment.bind(this)
    this.state = {
      comment: null
    }
  }

  addComment() {
    const {createComment, xCoord, yCoord, articleId, userAddress, isInternal} = this.props
    const comment = {
      userAddress: userAddress,
      text: this.state.comment,
      xCoord: xCoord,
      yCoord: yCoord,
      articleId: articleId,
      isInternal: isInternal
    }
    createComment(comment)
  }

  render() {
    const {xCoord, yCoord} = this.props
    return (
      <div className="comment-bar" style={{position: 'absolute', top: (yCoord-85), left: xCoord}}>
        <textarea 
          placeholder="Suggest an edit"
          onChange={(e) => this.setState({comment: e.target.value})}></textarea>
        <div className="comment-buttons">
          <button className="btn btn-sm btn-primary" onClick={this.addComment} >Submit</button>
        </div>
      </div>
    )
  }
}
