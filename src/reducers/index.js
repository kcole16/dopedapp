import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user'
import web3Reducer from './web3'
import postReducer from './posts'
import searchReducer from './search'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  web3: web3Reducer,
  posts: postReducer,
  search: searchReducer
})

export default reducer
