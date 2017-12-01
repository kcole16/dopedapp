import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions/index'
import SearchInput, {createFilter} from 'react-search-input'


class SearchBar extends Component {

  constructor(props) {
    super(props)
    this.updateSearch = this.updateSearch.bind(this)
    this.state = {
      searchTerm: ''
    }
  }

  updateSearch(e) {
    const {actions} = this.props
    actions.fetchResults(e.target.value)
    this.setState({searchTerm: e.target.value})
  }

  render() {
    const {results, actions} = this.props
    const resultsList = results.map((result, index) => {
      return (
          <div key={index} className="search-result">
            <p onClick={() => actions.fetchArticle(result.id)}>{result.title}</p>
          </div>
        )
    })
    return (
      <div className="search-bar">
        <input className="form-control" onChange={this.updateSearch} />
        <div className="search-results">
          {resultsList}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    results: state.search.results
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
)(SearchBar)