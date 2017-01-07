import React, { PropTypes,Component } from 'react';
import { BrowserRouter, Match } from 'react-router';
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

    const MatchWithAuth = ({ component: Component, ...rest }) => (
      <Match {...rest} render={props => {
        if(auth.pathname && props.pathname !== auth.pathname){
          this.props.dispatch(fetchLoginState({ pathname: props.pathname, auth: auth }));
        }
        return (auth.isLoggedIn && rest.private) || !rest.private ?
          <Component {...props}/> : <Dialog />;
      }}/>
    );

    return (
      <div className="wrapper">
        <BrowserRouter>
          {({router, location}) => (
            <div style={{height: '100%'}}>
              <MatchWithAuth pattern="/" exactly private component={() => <Private router={router} />}/>
              <MatchWithAuth pattern="/login"  component={() => <Login router={router} />}/>
              <MatchWithAuth pattern="/private2" private component={() => <Private2 router={router} />}/>
            </div>
          )}
        </BrowserRouter>
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
      </div>
    );
  }
}

App.propTypes = propTypes;

function select({ auth }) {
  return { auth };
}
export default connect(select)(App);
