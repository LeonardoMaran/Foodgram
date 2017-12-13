import React from 'react';
import {render} from 'react-dom';
//import {HashRouter as Router, Route, Link} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Main from './components/Main.jsx';

require('./styles/main.css');

render(
    <Main />,
    document.getElementById('root')
);
