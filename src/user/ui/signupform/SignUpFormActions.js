import AuthenticationContract from '../../../../build/contracts/Authentication.json'
import { loginUser } from '../loginbutton/LoginButtonActions'
import { fetchCreateUser } from '../../../actions/user'
import store from '../../../store'

const contract = require('truffle-contract')

export function signUpUser(user) {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Authentication.
      var authenticationInstance

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        // Log errors, if any.
        if (error) {
          console.error(error);
        }

        authentication.deployed().then(function(instance) {
          authenticationInstance = instance
          // Attempt to sign up user.
          authenticationInstance.signup(user.firstName, {from: coinbase})
          .then(function(result) {
            console.log(result)
            // If no error, login user.
            user['address'] = coinbase
            return dispatch(fetchCreateUser(user))
          })
          .catch(function(result) {
            console.log('Error')
            console.log(result)
            // If error...
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
