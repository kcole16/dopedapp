const initialState = {
  data: null
}

export default function userReducer(state = initialState, action) {
  if (action.type === 'USER_LOGGED_IN' || action.type === 'USER_UPDATED')
  {
    return {
      ...state,
      data: action.payload
    }
  }

  if (action.type === 'USER_LOGGED_OUT')
  {
    return {
      ...state,
      data: null
    }
  }

  if (action.type === 'GET_USER')
  {
    return {
      ...state,
      data: action.user
    }
  }

  return state
}
