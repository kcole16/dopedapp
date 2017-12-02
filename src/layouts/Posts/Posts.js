import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../actions/index'

class Posts extends React.Component {
  constructor () {
    super()
  }

  componentDidMount() {
    const {posts, actions} = this.props
    actions.fetchPosts()
  }

  render () {
    const {posts} = this.props
    const postList = posts.posts.map((post, index) => {
      return (
          <div key={index} style={{display: 'flex', flexDirection: 'row'}}>
            <p>{post.args.pictureHash}</p>
            <p>{post.args.contentHash}</p>
          </div>
        )
    })
    return (
      <div>
        {postList}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts,
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
)(Posts)
