import React, { Component } from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom';

import Login from './Login/Login.jsx';
import Recipes from './Recipes/Recipes.jsx';
import Users from './Users/Users.jsx';
import Favorites from './Favorites/Favorites.jsx';
import Profile from './Profile/Profile.jsx';

require('../styles/main.css');

export class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
			show: "none",
			username: ""
		}
		this.handler = this.handler.bind(this);
	}

	handler(username) {
    	this.setState({ 
    		show: "block", 
    		username: username 
    	});
    	console.log(window.location);
    	window.location = '/#/recipes';
	}

    render(){
    	var headerStyle = {
            display: this.state.show
        };

        return(
        	<Router>
		        <div className='Router'>
		            <div className="header" style = {headerStyle}>
		                <span className="nav_title">Foodgram</span>
		                <span><Link to="/profile">Profile</Link></span>
		                <span><Link to="/favorites">Favorites</Link></span>
		                <span><Link to="/users">Users</Link></span>
		                <span><Link to="/recipes">Recipes</Link></span>
		            </div>
		            <Route exact path="/" render={(props) => (
  						<Login handler={this.handler} />
					)}/>
					<Route path="/recipes" render={(props) => (
  						<Recipes user={this.state.username} />
					)}/>
					<Route path="/users" render={(props) => (
  						<Users user={this.state.username} />
					)}/>
					<Route path="/favorites" render={(props) => (
  						<Favorites user={this.state.username} />
					)}/>
					<Route path="/profile" render={(props) => (
  						<Profile user={this.state.username} />
					)}/>
		        </div>
		    </Router>
        );
    }
}

export default Main
