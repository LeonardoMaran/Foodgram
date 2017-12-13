import React, { Component } from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import axios from 'axios';

import Login from './Login/Login.jsx';
import Recipes from './Recipes/Recipes.jsx';
import Users from './Users/Users.jsx';
import Favorites from './Favorites/Favorites.jsx';
import Profile from './Profile/Profile.jsx';
import RecipesDetailed from './Recipes/RecipesDetailed.jsx';

require('../styles/main.css');

export class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
			show: "none",
			id: ""
		};
		this.handler = this.handler.bind(this);
	}

	handler(username) {
				const user = '';
				const url = 'http://localhost:3000/api/users?&where={"username":"' + username + '"}';
				axios.get(url)
				.then(function(response) {
		                this.setState({id: response.data.data[0]._id});
		            }.bind(this))
		            .catch(function(error) {
		                console.log(error);
		        });

		    	this.setState({
		    		show: "block",
		    		id: user
		    	});
		    	window.location = '/#/recipes';
	}

    render(){
    	var headerStyle = {
            display: this.state.show
        };

        if(this.state.id != "") {
        	var recipeRoute = <Route path="/recipes" render={(props) => (<Recipes user={this.state.id} />)} />;
        	var userRoute = <Route path="/users" render={(props) => (<Users user={this.state.id} />)} />;
        	var favoriteRoute = <Route path="/favorites" render={(props) => (<Favorites user={this.state.id} />)} />;
        	var profileRoute = <Route path="/profile" render={(props) => (<Profile user={this.state.id} />)} />;
        } else {
        	var recipeRoute = null;
        	var userRoute = null;
        	var favoriteRoute = null;
        	var profileRoute = null;
        }

        return(
	        	<Router>
		        	<div className='Router'>
						<header style = {headerStyle}>
							<div className="nav_bar_container">
								<a href="" id="logo_text">Foodgram <i className="fa fa-cutlery" aria-hidden="true"></i></a>
								<nav>
									<ul className="nav_bar_items">
										<li><Link to="/profile"><p className="navLinks">Profile</p></Link></li>
										<li><Link to="/favorites"><p className="navLinks">Favorites</p></Link></li>
										<li><Link to="/users"><p className="navLinks">Users</p></Link></li>
										<li><Link to="/recipes"><p className="navLinks">Recipes</p></Link></li>
									</ul>
								</nav>
							</div>
						</header>
						<Route path="/recipe_details" component={RecipesDetailed} />
						<Route exact path="/" render={(props) => (
								<Login handler={this.handler} />
							)}/>
						{recipeRoute}
						{userRoute}
						{favoriteRoute}
						{profileRoute}
			        </div>
		    	</Router>
        );
    }
}

export default Main
