import React from 'react';
import Loading from 'react-loading';

function InitialLoading() {
  const loadingWrapStyle = {
    position: 'relative',
    background: 'rgba(000, 000, 000, 0.7)',
    height: '100%'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  };

  return (
    <div className="loading-wrap" style={loadingWrapStyle}>
      <div style={loadingStyle}>
        <Loading type='bars' color='#8BC34A' />
      </div>
    </div>
  );
}

export default InitialLoading;
