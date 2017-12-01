import React, { Component } from 'react'

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      type: 'user'
    }
  }

  onInputChange(event) {
    const state = this.state
    state[event.target.name] = event.target.value
    this.setState(state)
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.state.firstName.length < 2)
    {
      return alert('Please fill in your name.')
    }
    const user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      type: this.state.type
    }

    this.props.onSignUpFormSubmit(user)
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input 
            className="form-control" 
            id="firstName" 
            name="firstName" 
            type="text" 
            value={this.state.firstName} 
            onChange={this.onInputChange.bind(this)} 
            placeholder="First Name" />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Name</label>
          <input 
            className="form-control" 
            id="lastName" 
            name="lastName" 
            type="text" 
            value={this.state.lastName} 
            onChange={this.onInputChange.bind(this)} 
            placeholder="Last Name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            className="form-control" 
            id="email" 
            name="email" 
            type="text" 
            value={this.state.email} 
            onChange={this.onInputChange.bind(this)} 
            placeholder="Email" />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select 
            className="form-control" 
            id="type" 
            name="type" 
            value={this.state.type} 
            onChange={this.onInputChange.bind(this)}>
            <option value="user">User</option>
            <option value="provider">Provider</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    )
  }
}

export default SignUpForm
