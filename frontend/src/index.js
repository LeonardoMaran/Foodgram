// eventually index needs to lead to the login page
// this will be the stuff for the login page
// and everything will be moved into main.jsx and the css will lead to main.css

import React from 'react';
import {render} from 'react-dom';
//import {HashRouter as Router, Route, Link} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

// import Login from './components/Login/Login.jsx';
// import Recipes from './components/Recipes/Recipes.jsx';
// import Users from './components/Users/Users.jsx';
// import Favorites from './components/Favorites/Favorites.jsx';
// import Profile from './components/Profile/Profile.jsx';
import Main from './components/Main.jsx';

require('./styles/main.css');

render(
    <Main />,
    // Define your router and replace <Home /> with it!
    document.getElementById('root')
);
