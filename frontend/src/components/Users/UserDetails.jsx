import React, { Component } from 'react';
import { Input, Dropdown, Image, Item, Grid, Divider} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/userdetails.css';

export class UserDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.location.param.user_id,
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
    }
    componentWillMount(){
        if(typeof this.props.location.param !== "undefined"){
            const url = 'http://localhost:4000/api/users/' + this.props.location.param.user_id;
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
                axios.get('http://localhost:4000/api/recipes/')
                    .then(function(response) {
                        for(var i = 0; i < response.data.data.length; i++) {
                          if(response.data.data[i].postedBy === this.props.location.param.user_id)
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
    }
    favoriteClick(idx, e) {
    		        //e.stopPropagation();

    		        let favoritedRecipe = this.state.recipes[idx];
    		        let recipeId = favoritedRecipe._id;
    		        // check if this recipe is favorited or unfavorited
    		        if (this.state.favorites.indexOf(recipeId) !== -1) {
    		            let url = 'http://localhost:4000/api/users/unfavoriteRecipe/' + this.state.currentUser;
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
    		            let url = 'http://localhost:4000/api/users/favoriteRecipe/' + this.state.currentUser;
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
            let url = 'http://localhost:4000/api/users/follow/' + this.state.currentUser;
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
            let url = 'http://localhost:4000/api/users/unfollow/' + this.state.currentUser;
            axios.put(url, {
                followingId: unfollowUserId
            }).then(function(response) {
    					let user = response.data.data;
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
              var recipeDisplay =
                  <div className="Recipes">
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

          let userCards = this.state.following.map((user, index) => {
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
                                          user_id: user._id
                                      }}}>
                                      <h2>{user.name}</h2>
                              </Link>
                          </div>
                          <div className="UserImage">
                            <Link key={index} style={{color: 'white'}}
                                  to={{ pathname: '/user_details',
                                      param: {
                                          user_id: user._id
                                      }}}>
                                  <Image size='medium' src={user.profilePicUrl} />
                            </Link>
                          </div>
                      </div>
                  </div>
              )
          });

      if(this.state.following.length > 0)
          var followingDisplay =
              <div className="Users">
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
                              <Item.Description>Number of Followers: {this.state.followers}</Item.Description>
                              <Item.Description>Number of Recipes: {this.state.recipes.length}</Item.Description>
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


export default UserDetails
