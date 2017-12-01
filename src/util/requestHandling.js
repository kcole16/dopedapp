import {store} from '../store'
import fetch from 'isomorphic-fetch'

let app_url = window.document.domain
if (app_url === 'localhost') {
  app_url = 'http://localhost:5000'
} else {
  app_url = 'http://' + app_url
}

export const url_base = app_url

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Cache-Control': 'no-cache'
}

function generateHeaders() {
  const headers = defaultHeaders
  // const store = store()
  // const state = store.getState()
  // headers['Authorization'] = 'JWT ' + state.user.token
  return headers
}

export function generateRequest(method, route, args) {
  const url = url_base + route
  const obj = {
    method: method,
    headers: generateHeaders()
  }
  if (args) {
    obj.body = JSON.stringify(args)
  }
  return {obj, url}
}

export function fetchResponse(req, dispatch, route) {
  return fetch(req.url, req.obj)
  .then((res) => {
    if (res.status === 401) {
      window.localStorage.clear()
      throw new Error('Not Logged In')
    } else if (res.status === 200 || res.status === 201) {
      return res.json()
    } else {
      window.localStorage.clear()
      throw new Error('Error: ' + res.status)
    }
  })
}
