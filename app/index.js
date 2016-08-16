//@flow
import './style/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app/app';
import { createStore} from 'redux';
import root from './reducers/root.js';

const store = createStore(root);

const template = (
	<Provider store={store}>
	  <App />
	</Provider>
);
ReactDOM.render(template	, document.getElementById('root'));