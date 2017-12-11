import React, { Component } from 'react';
import { Input, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

import styles from '../../styles/recipes.css';

export class Recipes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
            visible: [],
            filter: ""
        };
    }

    componentWillMount(){
        getRecipes()
            .then(function(response) {
                this.setState({recipes: response.data.data, visible: response.data.data});
                console.log(this.state.recipes);
            }.bind(this))
            .catch(function(error) {
                console.log(error);
        });
    }

    searchRecipes(event) {
        console.log(this.state.recipes);
        // var recipes = [];
        // for(var i = 0; i < this.state.recipes.length; i++) {
        //   if(this.state.recipes[i].title.toLowerCase().includes(event.currentTarget.value) && event.currentTarget.value != '') {
        //       recipes.push(this.state.recipes[i]);
        //   }
        // }
        // this.setState({visible: recipes});
    }

    handleChange(e, { value }) {
        switch (value) {
          case "rank":

            break;
          case "title":

            break;
          default:

        }
    }
    render() {
        console.log(this.state.recipes);
        const sortOptions = [
            {
              text: 'Rank',
              value: 'rank'
            },
            {
              text: 'Title',
              value: 'title'
            }
        ];

        const recipes = this.state.visible.map((recipe, index) => {
            var recipeStyle = {
                  backgroundImage: 'url(' + recipe.imageUrl + ')'
            };
            return (
                <div key={index} className="Recipe" style={recipeStyle}>
                    <div className="RecipeText">
                        <h2>{recipe.title}</h2>
                    </div>
                </div>
            );
        });

        return(
            <div className="Recipes">
                <h1>Recipes</h1>
                <div className="Search">
                  <p id="search_label">Search</p>
                  <Input className='search_bar' type='text' placeholder='Search movies...' onChange={this.searchRecipes} />
                  <p>Sort By</p>
                  <Dropdown className='sort_menu' defaultValue={sortOptions[0].value} onChange={this.handleChange} search selection options={sortOptions} />
                </div>
                <div className="Found">
                  {recipes}
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
