import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { clickLogout, hello } from '../../redux/auth/actions/auth';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
};

class Private extends Component {

  handleSignOut = this.handleSignOut.bind(this);
  handleSignOut(e) {
    e.preventDefault();
    this.props.dispatch(clickLogout());
  }

  handleHello = this.handleHello.bind(this);
  handleHello(e){
    e.preventDefault();
    this.props.dispatch(hello({jwt: this.props.auth.jwt, path: 'hello'}));
  }

  handleGoodNight = this.handleGoodNight.bind(this);
  handleGoodNight(e){
    e.preventDefault();
    this.props.dispatch(hello({jwt: this.props.auth.jwt, path: 'good-night'}));
  }

  render() {
    const { hello } = this.props.auth;

    return (
      <div className="container">
        <h1>Private</h1>
        { hello && <h2>{hello.Message}</h2> }
        <form className="form">
          <Link to='private2' className='button'>Private2</Link>
          <button className='button' onClick={this.handleSignOut}>Logout</button>
          <button className='button' onClick={this.handleHello}>Hello</button>
          <button className='button' onClick={this.handleGoodNight}>GoodNight</button>
        </form>
      </div>
    );
  }
}

Private.propTypes = propTypes;

function select({ auth }) {
  return { auth };
}
export default connect(select)(Private);
