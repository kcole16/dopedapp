import React, { Component } from 'react'

export default class CommentDisplay extends Component {
  // constructor(props) {
  //   super(props)
  //   this.addComment = this.addComment.bind(this)
  //   this.state = {
  //     comment: null
  //   }
  // }

  render() {
    const {comments, highlightedComment} = this.props
    const commentsList = comments.map((comment, index) => {
      const color = highlightedComment === comment.id ? '#45b3e7' : '#505559'
      return (
          <div key={index} className="comment">
            <p style={{fontWeight: 'bolder', paddingLeft: 15, color: color}}>{comment.user.firstName} {comment.user.lastName}</p>
            <p className="comment-text" style={{color: color}}>"{comment.text}"</p>
          </div>
        )
    })
    return (
      <div className="comment-display col">
        <div style={{height: 50, width: 285, paddingTop: 15, paddingLeft: 10, backgroundColor: '#f9f9f9', borderBottom: '1px dotted lightgray', borderRight: '1px solid lightgray'}}>
          <h5>Suggested Edits</h5>
        </div>
        {commentsList}
      </div>
    )
  }
}
