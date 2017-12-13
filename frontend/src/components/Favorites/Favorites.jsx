import React, { Component } from 'react';
import { Input, Dropdown, List, Image } from 'semantic-ui-react';
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
		        for(var i = 0; i < response.data.data.length; i++) {
		        	const url = 'http://localhost:4000/api/recipes/' + response.data.data[i];
			        axios.get(url)
			            .then(function(response) {
			                recipes.push(response.data.data);
			            }.bind(this))
			            .catch(function(error) {
			                console.log(error);
			        });
		        }
		        console.log(response.data.data.length);
		        if(recipes.length != response.data.data.length)
		        	this.setState({recipes: recipes, visible: recipes});
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
                <h1>Recipes</h1>
                <div className="Search">
                    <Input className='search_bar' type='text' placeholder='Search favorites...' onChange={this.searchRecipes} />
                    <p>Search By</p>
                    <Dropdown className='sort_menu' defaultValue={sortOptions[0].value} onChange={this.handleChange} search selection options={sortOptions} />
                </div>
                <div className="Found">
                    <List horizontal animated relaxed="very">
                        { this.state.visible.map((favorite, index) => (
                            <List.Item key={index}>
                                      <div className="Favorite">
                                          <div className="FavoriteText">
                                              <h2>{favorite.title}</h2>
                                          </div>
                                          <div className="FavoriteImage">
                                              <Image inline size='medium' src={favorite.imageUrl} />
                                          </div>
                                      </div>
                            </List.Item>
                         ))}
                      </List>
                </div>
            </div>
        );
    }
}

export default Favorites
