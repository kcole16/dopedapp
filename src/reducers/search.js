const initialState = {
  results: [],
  article: {}
}

export default function store(state = initialState, action = {}) {
  if (action.type === 'GET_RESULTS') {
    return {
      ...state,
      results: action.results
    }
  }

  if (action.type === 'GET_ARTICLE') {
    return {
      ...state,
      article: action.article
    }
  }

  return state
}
