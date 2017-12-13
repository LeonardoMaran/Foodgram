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
            followingId: [],
            followers: 0,
            title: "",
            description: "",
            ingredients: "",
            instructions: "",
            imageUrl: ""
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.followClick = this.followClick.bind(this);
        this.unfollowClick = this.unfollowClick.bind(this);
        this.favoriteClick = this.favoriteClick.bind(this);
        this.handleUpdateTitle = this.handleUpdateTitle.bind(this);
    		this.handleUpdateDescription = this.handleUpdateDescription.bind(this);
    		this.handleUpdateIngredients = this.handleUpdateIngredients.bind(this);
    		this.handleUpdateInstructions = this.handleUpdateInstructions.bind(this);
    		this.handleUpdateUrl = this.handleUpdateUrl.bind(this);
    }

    toggleModal() {
		this.setState({modalOpen: !this.state.modalOpen});
	}

	handleUpdateTitle(event) {
		this.setState({title: event.target.value});
	}

	handleUpdateDescription(event) {
		this.setState({description: event.target.value});
	}

	handleUpdateIngredients(event) {
		this.setState({ingredients: event.target.value});
	}

	handleUpdateInstructions(event) {
		this.setState({instructions: event.target.value});
	}

	handleUpdateUrl(event) {
		this.setState({imageUrl: event.target.value});
	}

	handleAddRecipe(event) {
		axios.post('http://104.131.161.44:4000/api/recipes', {
			  postedBy: this.state.currentUser,
			  title: this.state.title,
			  description: this.state.description,
			  ingredients: (this.state.ingredients === '') ? [] : this.state.ingredients.split(','),
			  instructions: this.state.instructions,
			  imageUrl: this.state.imageUrl
			})
			.then(function(response) {
            var recipes = [];
            axios.get('http://104.131.161.44:4000/api/recipes/')
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
			}.bind(this))
			.catch(function(error) {
				// Log response
				console.log(error);
			});
      this.toggleModal();
	}

	favoriteClick(idx, e) {
		        //e.stopPropagation();

		        let favoritedRecipe = this.state.recipes[idx];
		        let recipeId = favoritedRecipe._id;
		        // check if this recipe is favorited or unfavorited
		        if (this.state.favorites.indexOf(recipeId) !== -1) {
		            let url = 'http://104.131.161.44:4000/api/users/unfavoriteRecipe/' + this.state.currentUser;
		            axios.put(url, {
		                recipeId: recipeId
		            }).then(function(response) {
		                // Log response
		                let user = response.data.data;
		                this.setState({
		                    favorites: user.favorites
		                });
		            }.bind(this))
		                .catch(function(error) {
		                    // Log response
		                    console.log(error);
		                });
		        } else {
		            let url = 'http://104.131.161.44:4000/api/users/favoriteRecipe/' + this.state.currentUser;
		            axios.put(url, {
		                recipeId: recipeId
		            }).then(function(response) {
		                // Log response
		                let user = response.data.data;
		                this.setState({
		                    favorites: user.favorites
		                });
		            }.bind(this))
		            .catch(function(error) {
		                // Log response
		                console.log(error);
		            });
		        }
		    }

	followClick(idx, e) {
        e.stopPropagation();

        let followUser = this.state.following[idx];
        let followUserId = followUser._id;
        var id = this.state.followingId
        // follow user
        let url = 'http://104.131.161.44:4000/api/users/follow/' + this.state.currentUser;
        axios.put(url, {
            followingId: followUserId
        }).then(function(response) {
            // Log response
            let user = response.data.data;
					id.push(id.indexOf(followUserId));
					this.setState({
							following : user.following,
							followingId: id
					});
        }.bind(this))
            .catch(function(error) {
                // Log response
                console.log(error);
            });
    }

    unfollowClick(idx, e) {
        e.stopPropagation();

        let unfollowUser = this.state.following[idx];
        let unfollowUserId = unfollowUser._id;
        var id = this.state.followingId
        var following = this.state.following;
        // unfollow user
        // follow user
        let url = 'http://104.131.161.44:4000/api/users/unfollow/' + this.state.currentUser;
        axios.put(url, {
            followingId: unfollowUserId
        }).then(function(response) {
					id.splice(id.indexOf(unfollowUserId), 1);
					for (var i = 0; i < following.length; i++) {
						if(following[i]._id === unfollowUserId)
							following.splice(i, 1);
					}
					this.setState({
							following : following,
							followingId: id
					});
        }.bind(this))
            .catch(function(error) {
                // Log response
                console.log(error);
            });
    }

    componentWillMount(){
        const url = 'http://104.131.161.44:4000/api/users/' + this.props.user;
        axios.get(url)
            .then(function(response) {
                this.setState({
                	name: response.data.data.name,
                	profilePicUrl: response.data.data.profilePicUrl,
                	followers: response.data.data.followers.length,
                	favorites: response.data.data.favorites,
                	followingId: response.data.data.following
                });
                var recipes = [];
		        axios.get('http://104.131.161.44:4000/api/recipes/')
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
		        axios.get('http://104.131.161.44:4000/api/users/')
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
              <div key={index} className="RecipeCard">
                    <div className="Recipe">
                        {favoriteImageDiv}
                        <div className="RecipeImage">
                          <Link key={index} style={{color: 'white'}}
                                to={{
                                    pathname: '/recipe_details',
                                    param: {
                                        original: 'Your Personal Recipes',
                                        recipe: recipe,
                                        recipes: this.state.recipes,
                                        index : index
                                    }
                                }}>
                                <Image size='medium' src={recipe.imageUrl} />
                          </Link>
                        </div>
                        <div className="RecipeText">
                          <Link key={index} style={{color: 'white'}}
                                to={{
                                    pathname: '/recipe_details',
                                    param: {
                                        original: 'Your Personal Recipes',
                                        recipe: recipe,
                                        recipes: this.state.visible,
                                        index : index
                                    }
                                }}>
                            <h2>{recipe.title}</h2>
                          </Link>
                        </div>
                   </div>
              </div>
            );
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
    	        if (user._id === this.state.currentUser) {
    	            // This user should not be shown
    	            return;
                }

                let userId = user._id;
                let followUserDiv;
                if (this.state.followingId.indexOf(userId) !== -1) {
                    followUserDiv =
                        <div className="UserStar" onClick={this.unfollowClick.bind(this, index)}>
                            <i className="fa fa-star fa-3x"></i>
                        </div>
                } else {
                    followUserDiv =
                        <div className="UserStar" onClick={this.followClick.bind(this, index)}>
                            <i className="fa fa-star-o fa-3x"></i>
                        </div>
                }

                return (
											<div key={index} className="UserCard">
                        <div className="User">
														{followUserDiv}
                            <div className="UserText">
																<Link key={index} style={{color: 'white'}}
																			to={{ pathname: '/user_details',
                                            param: {
                                                user_id: user._id,
  																							curr_user_id: this.state.currentUser
                                            }}}>
																				<h2>{user.name}</h2>
																</Link>
                            </div>
                            <div className="UserImage">
															<Link key={index} style={{color: 'white'}}
																		to={{ pathname: '/user_details',
                                          param: {
                                              user_id: user._id,
                                              curr_user_id: this.state.currentUser
                                          }}}>
                                		<Image size='medium' src={user.profilePicUrl} />
															</Link>
                            </div>
                        </div>
										</div>
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
					      <Item.Image>
					      	<div className="ProfPic"><Image size='medium' src={this.state.profilePicUrl} /></div>
					      </Item.Image>
					      <Item.Content verticalAlign='middle'>
					        <Item.Header>
					        	<h1 className="Names">{this.state.name}</h1>
					        </Item.Header>
					        <Item.Description>People Following: {this.state.following.length}</Item.Description>
					        <Item.Description>Number of Recipes: {this.state.recipes.length}</Item.Description>
                            <Button className="ProfileButton" onClick={this.toggleModal}>Add Recipe</Button>
                            <Button className="ProfileButton" onClick={this.props.handler}>Log out</Button>
                          </Item.Content>
					    </Item>
					</Item.Group>
                </div>
                { recipeDisplay }
	            { followingDisplay }
	            <Modal show={this.state.modalOpen} onClose={this.toggleModal}>
                	<div>
	                	<div className="ui input"><input type="text" value={this.state.title} onChange={this.handleUpdateTitle} placeholder="Title"/></div><br/>
		                <div className="ui input"><input type="text" value={this.state.description} onChange={this.handleUpdateDescription} placeholder="Description"/></div><br/>
		                <div className="ui input"><input type="text"  value={this.state.ingredients} onChange={this.handleUpdateIngredients} placeholder='Ingredients with ","'/></div><br/>
		                <div className="ui input"><input type="text" value={this.state.instructions} onChange={this.handleUpdateInstructions} placeholder="Instructions"/></div><br/>
				        <div className="ui input"><input type="text" value={this.state.imageUrl} onChange={this.handleUpdateUrl} placeholder="Link to recipe photo" width='400px'/></div><br/>
		                <button className="SignupButton ui primary button" onClick = {this.handleAddRecipe.bind(this)}>Add</button>
                	</div>
                </Modal>
            </div>
        );
    }
}

export default Profile
