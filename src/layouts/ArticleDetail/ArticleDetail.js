import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../actions/index'
import CommentBar from '../../components/CommentBar'
import CommentDisplay from '../../components/CommentDisplay'
import CommentIcon from '../../images/comment-icon.png'


class ArticleDetail extends Component {
  constructor(props) {
    super(props)
    this.showCommentBar = this.showCommentBar.bind(this)
    this.createComment = this.createComment.bind(this) 
    this.state = {
      xCoord: 0,
      yCoord: 0,
      isShown: false,
      highlightedComment: 0
    }
  }

  showCommentBar(e) {
    this.setState({xCoord: e.screenX, yCoord: e.screenY, isShown: !this.state.isShown})
  }

  createComment(comment) {
    const {article, actions} = this.props
    const xCoord = article.comments.length === 0 ? comment.xCoord + 300 : comment.xCoord
    comment.xCoord = xCoord
    actions.fetchCreateComment(comment, article.isInternal)
    this.setState({isShown: false})
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props !== nextProps) {
  //     this.setState({article: nextProps.article})
  //   }
  // }

  // componentWillMount() {
  //   const {article} = this.props
  //   const id = this.props.location.query.id
  //   const ticketsList = tickets.tickets
  //   const ticket = ticketsList.find((ticket) => parseInt(ticket.id) === parseInt(id))
  //   this.setState({ticket: ticket})
  // }

  render() {
    const {article, actions, user} = this.props
    let commentIcons = null
    if (article) {
      commentIcons = article.comments.map((comment, index) => {
        return (
            <img 
              className="comment-icon"
              key={index}
              src={CommentIcon} 
              onClick={() => this.setState({highlightedComment: comment.id})}
              style={{top: (comment.yCoord-100), left: comment.xCoord}}/>
          )
      })
    }
    return(
      <div>
        {this.state.isShown ? <CommentBar 
          userAddress={user.address}
          articleId={article.id}
          createComment={this.createComment}
          xCoord={this.state.xCoord}
          yCoord={this.state.yCoord}
          isInternal={article.isInternal} /> : null }
        {commentIcons}
        <div className="row">
          {article.comments.length > 0 ? <CommentDisplay
            comments={article.comments}
            highlightedComment={this.state.highlightedComment} /> : null}
          <div className="col" style={{marginLeft: 10}}>
            <h1>{article.title}</h1>
            <div onMouseDown={this.showCommentBar} dangerouslySetInnerHTML={{__html: article.contents}}/>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    article: state.search.article,
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
)(ArticleDetail)
