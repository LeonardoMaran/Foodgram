import React, { Component } from 'react';
import { Input, Dropdown, Image, Grid, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/favorites.css';

export class Favorites extends Component {

	constructor(props) {
        super(props);
        this.state = {
            currentUser: props.user,
            visible: [],
            favorites: [],
            recipes: [],
            searchBy: ""
        };
        this.searchFavorites = this.searchFavorites.bind(this);
        this.handleChange = this.handleChange.bind(this);
				this.favoriteClick = this.favoriteClick.bind(this);
    }

    componentWillMount(){
        const url = 'http://localhost:4000/api/users/favorites/' + this.props.user;
        axios.get(url)
            .then(function(response) {
                this.setState({favorites: response.data.data});
                var recipes = [];
                var data = response.data.data;
				const url = 'http://localhost:4000/api/recipes/';
		        axios.get(url)
		            .then(function(response) {
		                for(var i = 0; i < response.data.data.length; i++) {
		                	for(var j = 0; j < data.length; j++) {
		                		if(response.data.data[i]._id === data[j])
		                			recipes.push(response.data.data[i]);
		                	}
		                }
	        			this.setState({recipes: recipes, visible: recipes});
		            }.bind(this))
		            .catch(function(error) {
		                console.log(error);
		        });
            }.bind(this))
            .catch(function(error) {
                console.log(error);
        });
    }

    searchFavorites(event) {
        var favorites = [];
        for(var i = 0; i < this.state.recipes.length; i++) {
          if(this.state.searchBy === "title") {
              if(this.state.recipes[i].title.toLowerCase().indexOf(event.currentTarget.value) >= 0 && event.currentTarget.value !== '') {
                  favorites.push(this.state.recipes[i]);
              }
          } else {
              var added = false;
              for(var j = 0; j < this.state.recipes[i].ingredients.length; j++) {
                if(!added && this.state.recipes[i].ingredients[j].toLowerCase().indexOf(event.currentTarget.value) >= 0 && event.currentTarget.value !== '') {
                    favorites.push(this.state.recipes[i]);
                    added = true;
                }
              }
          }
        }
        if(favorites.length === 0 && event.currentTarget.value === "") {
            this.setState({visible: this.state.recipes});
        } else {
            this.setState({visible: favorites});
        }
    }

    handleChange(e, { value }) {
        switch (value) {
          case "title":
            this.setState({searchBy: value});
            break;
          case "ingredients":
            this.setState({searchBy: value});
            break;
          default:

        }
    }
		favoriteClick(idx, e) {
		        //e.stopPropagation();

		        let favoritedRecipe = this.state.visible[idx];
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
		                    favorites: user.favorites, visible: user.favorites
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
		                    favorites: user.favorites, visible: user.favorites
		                });
		            }.bind(this))
		            .catch(function(error) {
		                // Log response
		                console.log(error);
		            });
		        }
		    }
    render() {
        const sortOptions = [
            {
              text: 'Title',
              value: 'title'
            },
            {
              text: 'Ingredients',
              value: 'ingredients'
            }
        ];

				let favoriteCards = this.state.visible.map((recipe, index) => {
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
                                        recipes: this.state.visible,
                                        index : index
                                    }
                                }}>
                                <Image size='medium' src={recipe.imageUrl} />
                          </Link>
                        </div>
                        <div className="RecipeText">
                          <Link key={index} style={{color: 'white'}}
                                to={{
                                    pathname: '/user_details',
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


        return(

            <div className="Favorites">
                <h1>Favorites</h1>
                <div className="Search">
                    <Input className='search_bar' type='text' placeholder='Search recipes...' onChange={this.searchRecipes} />
                    <div className="SortBy">
                        <p className="sort_text">Search By:</p>
                        <Dropdown className='sort_menu' defaultValue={sortOptions[0].value} onChange={this.handleChange} search selection options={sortOptions} />
                   </div>
                </div>
                <Divider section></Divider>
                <div className="Found">
									<Grid centered relaxed padded='horizontally' verticalAlign='middle' columns='equal'>
											{favoriteCards}
									</Grid>
                </div>
            </div>
        );
    }
}

export default Favorites
