import {fetchResponse, generateRequest, url_base} from '../util/requestHandling'
import {browserHistory} from 'react-router'

export const CREATE_USER = 'CREATE_USER'
export const GET_USER = 'GET_USER'

export function getUser(user) {
  return {
    type: GET_USER,
    user: user
  }
}

export function fetchUser(userAddress) {
  const route = '/getUser?userAddress='+userAddress
  const req = generateRequest('GET', route)
  return dispatch => {
    return fetchResponse(req, dispatch, route)
    .then(json => dispatch(getUser(json.user)))
    .then(() => browserHistory.push('/dashboard'))
    .catch(err => console.log(err))
  }
}

export function fetchCreateUser(user) {
  const route = '/createUser'
  const payload = {
    user: user
  }
  const req = generateRequest('POST', route, payload)
  return dispatch => {
    return fetchResponse(req, dispatch, route)
    .then(() => alert('Account created'))
    .then(() => dispatch(fetchUser(user.address)))
    .catch(err => console.log(err))
  }
}
