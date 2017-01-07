import React, { Component } from 'react';
import { Link } from 'react-router';

class Private2 extends Component {
  render() {
    return (
      <div className="container">
        <form className="form">
          <h1>Private2</h1>
          <Link to='/' className='button'>Private</Link>
        </form>
      </div>
    );
  }
}

export default Private2;
