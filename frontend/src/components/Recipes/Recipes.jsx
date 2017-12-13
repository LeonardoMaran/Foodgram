import React, { Component } from 'react';
import { Input, Dropdown, Image, Grid, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/recipes.css';

export class Recipes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUserId: props.user,
            recipes: [],
            visible: [],
            favorites: [],
            searchBy: "title"
        };
        this.searchRecipes = this.searchRecipes.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.favoriteClick = this.favoriteClick.bind(this);
    }

    componentWillMount(){
        getRecipes()
            .then(function(response) {
                this.setState({recipes: response.data.data, visible: response.data.data});
            }.bind(this))
            .catch(function(error) {
                console.log(error);
            });
        const url = 'http://localhost:4000/api/users/favorites/' + this.state.currentUserId;
        axios.get(url)
            .then(function(response) {
                this.setState({favorites: response.data.data});
            }.bind(this))
            .catch(function(error) {
                console.log(error);
            });
    }

    searchRecipes(event) {
        var recipes = [];
        for(var i = 0; i < this.state.recipes.length; i++) {
          if(this.state.searchBy === "title") {
              if(this.state.recipes[i].title.toLocaleLowerCase().includes(event.currentTarget.value.toLocaleLowerCase()) && event.currentTarget.value !== '') {
                  recipes.push(this.state.recipes[i]);
              }
          } else {
              var added = false;
              for(var j = 0; j < this.state.recipes[i].ingredients.length; j++) {
                if(!added && this.state.recipes[i].ingredients[j].toLocaleLowerCase().includes(event.currentTarget.value.toLocaleLowerCase()) && event.currentTarget.value !== '') {
                    recipes.push(this.state.recipes[i]);
                    added = true;
                }
              }
          }
        }
        if(recipes.length === 0 && event.currentTarget.value === "") {
            this.setState({visible: this.state.recipes});
        } else {
            this.setState({visible: recipes});
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
            let url = 'http://localhost:4000/api/users/unfavoriteRecipe/' + this.state.currentUserId;
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
            let url = 'http://localhost:4000/api/users/favoriteRecipe/' + this.state.currentUserId;
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

        let topButtonDiv =
            <div className="Search">
                <Input className='search_bar' type='text' placeholder='Search recipes...' onChange={this.searchRecipes} />
                <div className="SortBy">
                    <p className="sort_text">Search By:</p>
                    <Dropdown className='sort_menu' defaultValue={sortOptions[0].value} onChange={this.handleChange} search selection options={sortOptions} />
                </div>
            </div>;

        let recipeCards = this.state.visible.map((recipe, index) => {
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

        return(
            <div className="Recipes">
                <h1>Recipes</h1>
                {topButtonDiv}
                <Divider section></Divider>
                <div className="Found">
                    <Grid centered relaxed padded='horizontally' verticalAlign='middle' columns='equal'>
                        {recipeCards}
                    </Grid>
                </div>
            </div>
        );
    }
}

function getRecipes(){
    return axios({
        method: 'get',
        baseURL: 'http://localhost:4000/api/',
        url: 'recipes'
    });
}

export default Recipes
