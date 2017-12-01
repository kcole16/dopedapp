const initialState = {
  posts: [],
  post: {updates: []}
}

export default function store(state = initialState, action = {}) {
  if (action.type === 'GET_POSTS') {
    return {
      ...state,
      posts: action.posts
    }
  }

  return state
}
