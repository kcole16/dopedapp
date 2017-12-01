import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './App.css'
import './index.css'

class App extends Component {
  render() {

    return (
      <div className="App">

        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          <Link className="navbar-brand" to="/dashboard">DopeDapp</Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          </div>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

export default App