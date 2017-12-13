import React, { Component } from 'react';
import { Input, Dropdown, Image, Grid, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from '../../styles/favorites.css';

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
		                		if(response.data.data[i]._id == data[j])
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
              if(this.state.recipes[i].title.toLowerCase().includes(event.currentTarget.value) && event.currentTarget.value != '') {
                  favorites.push(this.state.recipes[i]);
              }
          } else {
              var added = false;
              for(var j = 0; j < this.state.recipes[i].ingredients.length; j++) {
                if(!added && this.state.recipes[i].ingredients[j].toLowerCase().includes(event.currentTarget.value) && event.currentTarget.value != '') {
                    favorites.push(this.state.recipes[i]);
                    added = true;
                }
              }
          }
        }
        if(favorites.length == 0 && event.currentTarget.value == "") {
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
                    <Grid centered relaxed padded='vertically' padded='horizontally'
                          verticalAlign='middle' columns='equal'>
                        { this.state.visible.map((recipe, index) => (
                            <Link key={index} to={{ pathname: '/recipe/' + recipe.title,
                                        param: {  recipe_id : recipe._id,
                                                  recipe_index : index
                                                }
                                      }}>
                                      <div className="Favorite">
                                          <div className="FavoriteText">
                                              <h2>{recipe.title}</h2>
                                          </div>
                                          <div className="FavoriteHeart">
                                              <i class="fa fa-heart fa-3x"></i>
                                          </div>
                                          <div className="FavoriteImage">
                                              <Image size='medium' src={recipe.imageUrl} />
                                          </div>
                                      </div>
                              </Link>
                         ))}
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

export default Favorites
