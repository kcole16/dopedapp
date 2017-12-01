import {fetchResponse, generateRequest, url_base} from '../util/requestHandling'
import {browserHistory} from 'react-router'

export const GET_RESULTS = 'GET_RESULTS'
export const GET_ARTICLE = 'GET_ARTICLE'

export function getResults(results) {
  return {
    type: GET_RESULTS,
    results: results
  }
}

export function getArticle(article) {
  return {
    type: GET_ARTICLE,
    article: article
  }
}

export function fetchResults(q) {
  const route = '/getResults?q='+q
  const req = generateRequest('GET', route)
  return dispatch => {
    return fetchResponse(req, dispatch, route)
    .then(json => dispatch(getResults(json.results)))
    .catch(err => console.log(err))
  }
}

export function fetchArticle(id, isInternal=false) {
  const route = '/getArticle?id='+id+'&isInternal='+isInternal
  const req = generateRequest('GET', route)
  return dispatch => {
    return fetchResponse(req, dispatch, route)
    .then(json => dispatch(getArticle(json.article)))
    .then(() => browserHistory.push('/article'))
    .catch(err => console.log(err))
  }
}
