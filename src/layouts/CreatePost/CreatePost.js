import React from 'react'
import ipfsAPI from 'ipfs-api'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../actions/index'

class Home extends React.Component {
  constructor () {
    super()
    this.state = {
      added_file_hash: null,
      content_hash: null,
      title: '',
      content: ''
    }
    this.ipfsApi = ipfsAPI('localhost', '5001')
  }

  componentDidMount() {
    const {state, actions} = this.props
    actions.fetchPosts()
    // setTimeout(() => actions.retrievePosts(), 2000)
  }

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.onloadend = () => this.saveFileToIpfs(reader)
    reader.readAsArrayBuffer(file)
  }

  saveFileToIpfs = (reader) => {
    let ipfsId
    const buffer = Buffer.from(reader.result)
    this.ipfsApi.add(buffer)
    .then((response) => {
      console.log(response)
      ipfsId = response[0].hash
      console.log(ipfsId)
      this.setState({added_file_hash: ipfsId})
    }).catch((err) => {
      console.error(err)
    })
  }

  saveContentToIpfs = () => {
    const {actions} = this.props
    let ipfsId
    const data = {
      title: this.state.title,
      content: this.state.content
    }
    this.ipfsApi.add(new Buffer.from(JSON.stringify(data)))
    .then((response) => {
      console.log(response)
      ipfsId = response[0].hash
      console.log(ipfsId)
      actions.createPost(ipfsId.substr(12,15), ipfsId, this.state.added_file_hash)
      this.setState({content_hash: ipfsId})
    }).catch((err) => {
      console.error(err)
    })
  }

  arrayBufferToString = (arrayBuffer) => {
    return String.fromCharCode.apply(null, new Uint16Array(arrayBuffer))
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.saveContentToIpfs()
  }

  render () {
    return (
      <div>
        <form id="captureMedia" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Title" value={this.state.title} onChange={(e) => this.setState({title:e.target.value})} />
          <input type="text" placeholder="Content" value={this.state.content} onChange={(e) => this.setState({content:e.target.value})} />
          <input type="file" onChange={this.captureFile} />
          <button type="submit">Chill</button>
        </form>
        <div>
          <a target="_blank"
            href={'https://ipfs.io/ipfs/' + this.state.added_file_hash}>
            {this.state.added_file_hash}
          </a>
        </div>
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
)(Home)
