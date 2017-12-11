// eventually index needs to lead to the login page
// this will be the stuff for the login page
// and everything will be moved into main.jsx and the css will lead to main.css

import React from 'react';
import {render} from 'react-dom';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import Login from './components/Login/Login.jsx';
import Recipes from './components/Recipes/Recipes.jsx';
import Users from './components/Users/Users.jsx';
import Favorites from './components/Favorites/Favorites.jsx';
import Profile from './components/Profile/Profile.jsx';

require('./styles/main.css');

render(
    <Router>
      <div className='Router'>
            <div className="header">
                <span className="nav_title">Foodgram</span>
                <span><Link to="/profile">Profile</Link></span>
                <span><Link to="/favorites">Favorites</Link></span>
                <span><Link to="/users">Users</Link></span>
                <span><Link to="/recipes">Recipes</Link></span>
            </div>
            <Route path="/recipes" component={Recipes}/>
            <Route path="/users" component={Users}/>
            <Route path="/favorites" component={Favorites}/>
            <Route path="/profile" component={Profile}/>
        </div>
    </Router>,
    // Define your router and replace <Home /> with it!
    document.getElementById('root')
);
