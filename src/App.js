import React, { PropTypes,Component } from 'react';
import {Route, Switch} from 'react-router-dom';

import { connect } from 'react-redux';
import './App.css';
import { Login, Private, Private2, Dialog } from './containers';
import { fetchLoginState } from './redux/auth/actions/auth';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

class App extends Component {
  componentWillMount() {
    const { pathname } = document.location;
    this.props.dispatch(fetchLoginState({ pathname: pathname }));
  }

  componentWillReceiveProps(nextProps) {
    const { auth } = nextProps;
    if(auth) { this.guestWillTransfer(auth); }
  }

  guestWillTransfer(auth) {
    const { pathname } = document.location;

    if (!auth.isLoggedIn && pathname !== '/login') {
      this.transferPage('/login', 3000);
    } else if(auth.isLoggedIn && pathname === '/login') {
      this.transferPage('/', 0);
    }
  }

  transferPage(path, time) {
    setTimeout(function() {
      document.location.href = path;
    }, time);
  }

  render() {
    const { auth } = this.props;

    const RouteWithAuth = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => {
        if(auth.pathname && props.location.pathname !== auth.pathname){
          this.props.dispatch(fetchLoginState({ pathname: props.pathname, auth: auth }));
        }
        return (auth.isLoggedIn && rest.private) || !rest.private ?
          <Component {...props}/> : <Dialog />;
      }}/>
    );

    return (
      <div className="wrapper">
        <Switch>

              <RouteWithAuth path="/" exact private component={() => <Private />}/>
              <RouteWithAuth path="/login" exact component={() => <Login />}/>
              <RouteWithAuth path="/private2" exact private component={() => <Private2 />}/>

        <ul className="bg-bubbles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        </Switch>
      </div>
    );
  }
}

App.propTypes = propTypes;

function select({ auth }) {
  return { auth };
}
export default connect(select)(App);
