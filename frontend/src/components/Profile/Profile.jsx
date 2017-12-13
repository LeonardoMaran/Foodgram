import React, { Component } from 'react';
import { Button, Item, Image, Grid, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/profile.css';

import Modal from '../Modal/Modal.jsx'

export class Profile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        	modalOpen: false,
            currentUser: props.user,
            name: "",
            profilePicUrl: "",
            favorites: [],
            recipes: [],
            following: [],
            followers: 0,

        };
        this.toggleModal = this.toggleModal.bind(this);
        this.followClick = this.followClick.bind(this);
        this.unfollowClick = this.unfollowClick.bind(this);
        this.favoriteClick = this.favoriteClick.bind(this);
    }

    toggleModal() {
		this.setState({modalOpen: !this.state.modalOpen});
	}

	favoriteClick(idx, e) {
        e.stopPropagation();

        let favoritedRecipe = this.state.recipes[idx];
        let recipeId = favoritedRecipe._id;
        // check if this recipe is favorited or unfavorited
        if (this.state.favorites.indexOf(recipeId) !== -1) {
            let url = 'http://localhost:4000/api/users/unfavoriteRecipe/' + this.state.currentUserId;
            axios.put(url, {
                recipeId: recipeId
            }).then(function(response) {
                // Log response
                console.log(response.data.message);
            }.bind(this))
                .catch(function(error) {
                    // Log response
                    console.log(error);
                });
        } else {
            let url = 'http://localhost:4000/api/users/favoriteRecipe/' + this.state.currentUserId;
            axios.put(url, {
                recipeId: recipeId
            }).then(function(response) {
                // Log response
                console.log(response.data.message);
            }.bind(this))
            .catch(function(error) {
                // Log response
                console.log(error);
            });
        }
    }

	followClick(idx, e) {
        e.stopPropagation();

        let followUser = this.state.visible[idx];
        let followUserId = followUser._id;
        // follow user
        let url = 'http://localhost:4000/api/users/follow/' + this.state.currentUserId;
        axios.put(url, {
            followingId: followUserId
        }).then(function(response) {
            // Log response
            console.log(response.data.message);
        }.bind(this))
            .catch(function(error) {
                // Log response
                console.log(error);
            });
    }

    unfollowClick(idx, e) {
        e.stopPropagation();

        let unfollowUser = this.state.visible[idx];
        let unfollowUserId = unfollowUser._id;
        // unfollow user
        // follow user
        let url = 'http://localhost:4000/api/users/unfollow/' + this.state.currentUserId;
        axios.put(url, {
            followingId: unfollowUserId
        }).then(function(response) {
            // Log response
            console.log(response.data.message);
        }.bind(this))
            .catch(function(error) {
                // Log response
                console.log(error);
            });
    }

    componentWillMount(){
        const url = 'http://localhost:4000/api/users/' + this.props.user;
        axios.get(url)
            .then(function(response) {
                this.setState({
                	name: response.data.data.name,
                	profilePicUrl: response.data.data.profilePicUrl,
                	followers: response.data.data.followers.length,
                	favorites: response.data.data.favorites
                });
                var recipes = [];
		        axios.get('http://localhost:4000/api/recipes/')
		            .then(function(response) {
		                for(var i = 0; i < response.data.data.length; i++) {
		                	if(response.data.data[i].postedBy === this.props.user)
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
		                		if(response.data.data[i]._id === follow[j])
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

    	let recipeCards = this.state.recipes.map((recipe, index) => {
            let recipeId = recipe._id;
            let favoriteImageDiv;
            if (this.state.favorites.indexOf(recipeId) !== -1) {
                favoriteImageDiv =
                    <div className="RecipeHeart" onClick={this.favoriteClick.bind(this, index)}>
                        <i className="fa fa-heart fa-3x"></i>
                    </div>
            } else {
                favoriteImageDiv =
                    <div className="RecipeHeart" onClick={this.favoriteClick.bind(this, index)}>
                        <i className="fa fa-heart-o fa-3x"></i>
                    </div>
            }

            return (
                <Link key={index}
                      to={{
                          pathname: '/recipe/' + recipe.title,
                          param: {
                              recipe_id : recipe._id,
                              recipe_index : index
                          }
                      }}>
                    <div className="Recipe">
                        <div className="RecipeText">
                            <h2>{recipe.title}</h2>
                        </div>
                        {favoriteImageDiv}
                        <div className="RecipeImage">
                            <Image size='medium' src={recipe.imageUrl} />
                        </div>
                    </div>
                </Link>
            )
        });

    	if(this.state.recipes.length > 0)
    		var recipeDisplay = <div className="Recipes">
	                <h1>Personal Recipes</h1>
	                <Divider section></Divider>
	                <div className="Found">
	                    <Grid centered relaxed padded='vertically' padded='horizontally'
	                          verticalAlign='middle' columns='equal'>
	                        { recipeCards }
	                     </Grid>
	                 </div>
	            </div>;
	    else
	    	var recipeDisplay = null;

	    let userCards =
            this.state.following.map((user, index) => {
                var followUserDiv =
                        <div className="UserStar" onClick={this.unfollowClick.bind(this, index)}>
                            <i className="fa fa-star fa-3x"></i>
                        </div>;

                return (
                    <Link key={index}
                          to={{ pathname: '/user/' + user.username,
                              param: {
                                  user_id: user.id,
                                  user_index: index
                              }}}>
                        <div className="User">
                            <div className="UserText">
                                <h2>{user.name}</h2>
                            </div>
                            {followUserDiv}
                            <div className="UserImage">
                                <Image size='medium' src={user.profilePicUrl} />
                            </div>
                        </div>
                    </Link>
                )
            });

	    if(this.state.following.length > 0)
    		var followingDisplay = <div className="Users">
	                <h1>Following</h1>
					<Divider section></Divider>
					<div className="Found">
						<Grid centered relaxed padded='vertically' padded='horizontally'
									verticalAlign='middle' columns='equal'>
							{ userCards }
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
					            Add Recipe
					          </Button>
					        </Item.Extra>
					      </Item.Content>
					    </Item>
					</Item.Group>
                </div>
                { recipeDisplay }
	            { followingDisplay }
	            <Modal show={this.state.modalOpen} onClose={this.toggleModal}>
                	<div className="Modal">
	                	<div className="ui input"><input type="text" value={this.state.title} onChange={this.handleUpdateTitle} placeholder="Title"/></div><br/>
		                <div className="ui input"><input type="text" value={this.state.description} onChange={this.handleUpdateDescription} placeholder="Description"/></div><br/>
		                <div className="ui input"><input type="password"  value={this.state.ingredients} onChange={this.handleUpdateIngredients} placeholder="Ingredients"/></div><br/>
		                <div className="ui input"><input type="password" value={this.state.instructions} onChange={this.handleUpdateInstructions} placeholder="instructions"/></div><br/>
				        <div className="ui input"><input type="text" value={this.state.imageUrl} onChange={this.handleUpdateUrl} placeholder="Link to recipe photo"/></div><br/>
		                <button className="SignupButton ui primary button" onClick = {this.handleRegister.bind(this)}>Add</button>
                	</div>
                </Modal>
            </div>
        );
    }
}

export default Profile
