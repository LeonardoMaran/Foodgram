import React, { Component } from 'react';
import { Button, Item, Image, Grid, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from '../../styles/profile.css';

export class Profile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            currentUser: props.user,
            name: "",
            profilePicUrl: "",
            recipes: [],
            following: [],
            followers: 0
        };
    }

    componentWillMount(){
        const url = 'http://localhost:4000/api/users/' + this.props.user;
        axios.get(url)
            .then(function(response) {
                this.setState({
                	name: response.data.data.name,
                	profilePicUrl: response.data.data.profilePicUrl,
                	followers: response.data.data.followers.length
                });
                var recipes = [];
		        axios.get('http://localhost:4000/api/recipes/')
		            .then(function(response) {
		                for(var i = 0; i < response.data.data.length; i++) {
		                	if(response.data.data[i].postedBy == this.props.user)
		                		recipes.push(response.data.data[i]);
		                }
	        			this.setState({recipes: recipes});
		            }.bind(this))
		            .catch(function(error) {
		                console.log(error);
		        });
		        var follow = response.data.data.following;
		        var following = [];
		        axios.get('http://localhost:4000/api/users/')
		            .then(function(response) {
		                for(var i = 0; i < response.data.data.length; i++) {
		                	for(var j = 0; j < follow.length; j++) {
		                		if(response.data.data[i]._id == follow[j])
		                			following.push(response.data.data[i]);
		                	}
		                }
	        			this.setState({following: following});
		            }.bind(this))
		            .catch(function(error) {
		                console.log(error);
		        });
            }.bind(this))
            .catch(function(error) {
                console.log(error);
        });
    }

    render() {
    	if(this.state.recipes.length > 0)
    		var recipeDisplay = <div className="Recipes">
	                <h1>Personal Recipes</h1>
	                <Divider section></Divider>
	                <div className="Found">
	                    <Grid centered relaxed padded='vertically' padded='horizontally'
	                          verticalAlign='middle' columns='equal'>
	                        { this.state.recipes.map((recipe, index) => (
	                            <Link key={index} to={{ pathname: '/recipe/' + recipe.title,
	                                        param: {  recipe_id : recipe._id,
	                                                  recipe_index : index
	                                                }
	                                      }}>
	                                      <div className="Recipe">
	                                          <div className="RecipeText">
	                                              <h2>{recipe.title}</h2>
	                                          </div>
	                                          <div className="RecipeHeart">
	                                              <i class="fa fa-heart-o fa-3x"></i>
	                                          </div>
	                                          <div className="RecipeImage">
	                                              <Image size='medium' src={recipe.imageUrl} />
	                                          </div>
	                                      </div>
	                              </Link>
	                         ))}
	                      </Grid>
	                  </div>
	            </div>;
	    else
	    	var recipeDisplay = null;

	    if(this.state.following.length > 0)
    		var followingDisplay = <div className="Users">
	                <h1>Following</h1>
					<Divider section></Divider>
					<div className="Found">
						<Grid centered relaxed padded='vertically' padded='horizontally'
									verticalAlign='middle' columns='equal'>
								{ this.state.following.map((user, index) => (
									<Link key={index} to={{ pathname: '/user/' + user.name,
															param: {  	user_id : user.id,
																		user_index : index
														  			}
															}}>
											<div className="User">
													<div className="UserText">
															<h2>{user.name}</h2>
													</div>
													<div className="UserStar">
															<i class="fa fa-star fa-3x"></i>
													</div>
													<div className="UserImage">
															<Image size='medium' src={user.profilePicUrl} />
													</div>
											</div>
									</Link>
							 ))}
						</Grid>
					</div>
	            </div>;
	    else
	    	var followingDisplay = null;

        return(
            <div className="Profile">
                <div className="Bio">
	                <Item.Group>
					    <Item>
					      <Item.Image size='medium' src={this.state.profilePicUrl} />
					      <Item.Content verticalAlign='middle'>
					        <Item.Header>
					        	<h1 className="Names">{this.state.name}</h1>
					        </Item.Header>
					        <Item.Description>Number of Followers: {this.state.followers}</Item.Description>
					        <Item.Description>Number of Recipes: {this.state.recipes.length}</Item.Description>
					      </Item.Content>
					      <Item.Content verticalAlign='bottom'>
					      	<Item.Extra>
					          <Button floated='right'>
					            Action
					          </Button>
					        </Item.Extra>
					      </Item.Content>
					    </Item>
					</Item.Group>
                </div>
                { recipeDisplay }
	            { followingDisplay }
            </div>
        );
    }
}

export default Profile
