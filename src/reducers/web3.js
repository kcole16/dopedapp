const initialState = {
  web3Instance: null
}

export default function web3Reducer(state = initialState, action) {
  if (action.type === 'WEB3_INITIALIZED')
  {
    return Object.assign({}, state, {
      web3Instance: action.payload.web3Instance
    })
  }

  return state
}
