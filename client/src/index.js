// index.js or another entry point
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAIyY4C-OPivpAncytCELY-fUCk9aJsDWc&libraries=places`;
script.defer = true;
script.async = true;

script.onload = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
};

document.body.appendChild(script);
