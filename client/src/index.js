import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider, teamsTheme, teamsDarkTheme, teamsV2Theme, MicrosoftStreamIcon } from '@fluentui/react-northstar';

export { default as Configure } from './configure';
// const root = 
// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <BrowserRouter>
  <Provider theme={teamsDarkTheme}>
    <App />
  </Provider></BrowserRouter>,
  document.getElementById('root')
);

// const root = ReactDOM.render(document.getElementById('root'));
// root.(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// const container = document.getElementById('App');
// render(<App/>, container);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


