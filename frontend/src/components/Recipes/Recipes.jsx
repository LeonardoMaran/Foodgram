import React, { Component } from 'react';
import { Input, Dropdown, Image, Grid, Divider, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/recipes.css';

export class Recipes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: props.user,
            recipes: [],
            visible: [],
            favorites: [],
            searchBy: ""
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
        const url = 'http://localhost:4000/api/users/favorites/' + this.props.user;
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
        e.stopPropagation();

        let favoritedRecipe = this.state.visible[idx];
        let id = favoritedRecipe._id;
        // Now add this id to user's favorite list
        let url = 'http://localhost:4000/api/users/favoriteRecipe/' + this.state.currentUser;
        axios.put(url, {
                recipeId: id
            })
            .then(function(response) {
                // Log response
                console.log(response.data.message);
            }.bind(this))
            .catch(function(error) {
                // Log response
                console.log(error);
            });
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
                favoriteImageDiv = <div className="RecipeHeart" onClick={this.favoriteClick.bind(this, index)}>
                    <i className="fa fa-heart fa-3x"></i>
                </div>
            } else {
                favoriteImageDiv = <div className="RecipeHeart" onClick={this.favoriteClick.bind(this, index)}>
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

        return(
            <div className="Recipes">
                <h1>Recipes</h1>
                {topButtonDiv}
                <Divider section></Divider>
                <div className="Found">
                    <Grid centered relaxed padded='horizontally'
                          verticalAlign='middle' columns='equal'>
                        { this.state.visible.map((recipe, index) => (
                            <Link key={index} to={{ pathname: '/recipe_details',
                                        param: {  recipe : recipe,
                                                  recipes: this.state.visible,
                                                  index : index,
                                                  user : this.props.user
                                                }
                                      }}>
                                      <div className="Recipe">
                                          <div className="RecipeText">
                                              <h2>{recipe.title}</h2>
                                          </div>
                                          <div className="RecipeHeart">
                                              <i className="fa fa-heart-o fa-3x"></i>
                                          </div>
                                          <div className="RecipeImage">
                                              <Image size='medium' src={recipe.imageUrl} />
                                          </div>
                                      </div>
                              </Link>
                         ))}
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
