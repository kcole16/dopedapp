import {fetchResponse, generateRequest, url_base} from '../util/requestHandling'
import {browserHistory} from 'react-router'
import store from '../store'
import PostContract from '../../build/contracts/Post.json'
import contract from 'truffle-contract'
import {GET_ARTICLE} from './search'

export const GET_POSTS = 'GET_POSTS'

function getPosts(posts) {
  return {
    type: GET_POSTS,
    posts: posts
  }
}

// export function retrievePosts() {
//   let web3 = store.getState().web3.web3Instance
//   if (typeof web3 !== 'undefined') {

//     return function(dispatch) {
//       // Using truffle-contract we create the authentication object.
//       const post = contract(PostContract)
//       let account
//       post.setProvider(web3.currentProvider)
//       web3.accounts().then((accounts, error) => {
//         if (error) {
//           console.error(error);
//         }
//         account = accounts[0]
//         web3.defaultAccount = account
//         post.deployed().then(function(instance) {
//           instance.addPost('123', '123', {from: account})
//             .then((posts) => {
//               console.log(posts)
//               dispatch(getPosts(posts))
//               // return browserHistory.push('/viewTickets')
//             })
//           })
//           .catch((result) => {
//             console.error(result)
//           })
//         })
//       }
//   } else {
//     console.error('Web3 is not initialized.');
//   }
// }


// export function retrievePosts() {
//   let web3 = store.getState().web3.web3Instance.eth
//   if (typeof web3 !== 'undefined') {

//     return function(dispatch) {
//         const post = contract(PostContract)
//         // const contract1 = new web3.eth.Contract(PostContract.abi)
//         // contract1.options.address = '0x9fc5a2c7958da73552edeaf0a0142369704ee830'
//         post.setProvider(web3.currentProvider)
//         web3.getAccounts().then((accounts) => {
//           web3.defaultAccount = 
//         })
//         // web3.getAccounts().then((i) => console.log(i))
//         post.deployed().then(function(instance) {
//           instance.PostCreated({}, {fromBlock:0, toBlock:'latest'}).get(function(err, results){console.log(results)})
//           // .catch((result) => {
//           //   console.error(result)
//           // })
//         })}
//   } else {
//     console.error('Web3 is not initialized.');
//   }
// }


export function createPost(id, content, pic) {
  let web3 = store.getState().web3.web3Instance.eth
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
        const post = contract(PostContract)
        web3.getAccounts().then((accounts) => {

          web3.defaultAccount = accounts[0]
          post.setProvider(web3.currentProvider)
          post.deployed().then(function(instance) {
            instance.addPost(id, pic, content, {from: web3.defaultAccount})
              .then((posts) => {
                return browserHistory.push('/')
              })
            })
            .catch((result) => {
              console.error(result)
            })
        })
      }
  } else {
    console.error('Web3 is not initialized.');
  }
}

export function fetchPosts() {
  const route = '/getPosts'
  const req = generateRequest('GET', route)
  return dispatch => {
    return fetchResponse(req, dispatch, route)
    .then((json) => dispatch(getPosts(json.posts)))
    .catch(err => console.log(err))
  }
}

