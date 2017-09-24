import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUser } from '../../redux/auth/actions/auth';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object
};

class Login extends Component {
  state = {
    email: '',
    password: ''
  };

  handleSignIn = this.handleSignIn.bind(this);
  handleSignIn(e) {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.dispatch(fetchUser({ email, password }));
  }

  handleChange(column, value) {
    const newState = {};
    newState[column] = value;

    this.setState(newState);
  }

  render() {
    const { auth } = this.props;
    const { email, password } = this.state;

    return (
      <div className="container">
        <h1>Cognito User Pool Login</h1>

        {auth.error && <p className="error">{auth.error}</p>}
        <form className="form" onSubmit={e => this.handleSignIn(e)}>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={e => this.handleChange('email', e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => this.handleChange('password', e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

function select({ auth }) {
  return { auth };
}

Login.propTypes = propTypes;

export default connect(select)(Login);
