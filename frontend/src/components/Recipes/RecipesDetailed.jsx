import React, { Component } from 'react';
import { Image, Divider } from 'semantic-ui-react';
import axios from 'axios';

import '../../styles/recipesdetailed.css';

export class RecipesDetailed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recipes : [],
            recipe: [],
            index: -1,
            user: []
        };
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }
    componentDidMount(){
        if(typeof this.props.location.param !== "undefined"){
            this.setState({
                recipes : JSON.stringify(this.props.location.param.recipes),
                recipe : JSON.stringify(this.props.location.param.recipe),
                index : JSON.stringify(this.props.location.param.index)
            });
            getUser(this.props.location.param.recipe.postedBy)
                  .then(function(response) {
                      this.setState({ user: response.data.data });
                  }.bind(this))
                  .catch(function(error) {
                        console.log(error);
                  });
        }
    }
    handlePrev(){
          let recipes = JSON.parse(this.state.recipes);
          let recipe = JSON.parse(this.state.recipe);
          let index = JSON.parse(this.state.index);
          if(index > 0){
              this.setState({
                  recipes : JSON.stringify(recipes),
                  recipe : JSON.stringify(recipes[index-1]),
                  index : JSON.stringify(index-1)
              });
          } else {
              this.setState({
                  recipes : JSON.stringify(recipes),
                  recipe : JSON.stringify(recipes[recipes.length-1]),
                  index : JSON.stringify(recipes.length-1)
              });
          }
          getUser(recipe.postedBy)
                .then(function(response) {
                    this.setState({ user: response.data.data });
                }.bind(this))
                .catch(function(error) {
                      console.log(error);
                });
      }
      handleNext(){
          let recipes = JSON.parse(this.state.recipes);
          let recipe = JSON.parse(this.state.recipe);
          let index = JSON.parse(this.state.index);
          if(index < recipes.length - 1){
              this.setState({
                   recipes : JSON.stringify(recipes),
                   recipe : JSON.stringify(recipes[index+1]),
                   index : JSON.stringify(index+1)
              });
          } else {
              this.setState({
                   recipes : JSON.stringify(recipes),
                   recipe : JSON.stringify(recipes[0]),
                   index : JSON.stringify(0)
              });
          }
          getUser(recipe.postedBy)
                .then(function(response) {
                    this.setState({ user: response.data.data });
                }.bind(this))
                .catch(function(error) {
                      console.log(error);
                });
      }
      render() {
          if(JSON.parse(this.state.index) === -1)
          {
              return(
                  <div className="Error">
                      <h1>ERROR: This page is unavailable.</h1>
                      <h3>Please return to recipes and select one to view detailed information.</h3>
                  </div>
              );
          } else {
              let recipes = JSON.parse(this.state.recipes);
              let recipe = JSON.parse(this.state.recipe);
              let index = JSON.parse(this.state.index);
              let user = this.state.user;
              console.log(user);
              return(
                  <div className="RecipesDetailed">
                      <h1> {index+1} / {recipes.length}</h1>
                      <div className="prev" onClick={this.handlePrev}>&#x21E6;</div>
                      <div className="next" onClick={this.handleNext}>&#x21E8;</div>
                      <h1> {recipe.title}</h1>
                      <div className="RecipesImage">
                          <Image centered size='large' src={recipe.imageUrl} />
                      </div>
                      <div className="RecipesContent">
                          <Divider section></Divider>
                          <div className="RecipesContentStuff">
                              <h2>Description:</h2>
                              <p>{recipe.description}</p>
                          </div>
                          <Divider section></Divider>
                          <div className="RecipesContentStuff">
                              <h2>Ingredients:</h2>
                              { recipe.ingredients.map((ingredient, key) => (
                                  <p key={key}>{ingredient}</p>
                              ))}
                          </div>
                          <Divider section></Divider>
                          <div className="RecipesContentStuff">
                              <h2>Posted By:</h2>
                              <img className="img-circle" src={user.profilePicUrl} />
                              <h3>{user.name}</h3>
                          </div>
                      </div>
                  </div>
              );
          }
      }
}

function getUser(id){
    return axios({
        method: 'get',
        baseURL: 'http://localhost:4000/api/',
        url: 'users/' + id
    });
}

export default RecipesDetailed
