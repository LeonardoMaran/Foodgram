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
    // componentDidMount(){
    //     if(typeof this.props.location.param !== "undefined"){
    //           getUser(this.props.location.param.user_id)
    //               .then(function(response) {
    //                   this.setState({
    //                     currentUser: this.props.location.param.user_id,
    //                     user: response.data.data
    //                   });
    //               }.bind(this))
    //               .catch(function(error) {
    //                   console.log(error);
    //               });
    //      }
    // }
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

    render(){
        if(typeof this.state.currentUser === "undefined"){
            return(
                <div className="Error">
                    <h1>ERROR: This page is unavailable.</h1>
                    <h3>Please return to users and select one to view detailed information.</h3>
                </div>
            );
        } else {
            return(
                <div className="Profile">
                    <h1>User Details</h1>
                    <div className="Bio">
  	                   <Item.Group>
  					               <Item>
              					       <Item.Image size='medium' src={this.state.profilePicUrl} />
              					       <Item.Content verticalAlign='middle'>
          					               <Item.Header>
          					        	          <h1 className="Names">{this.state.name}</h1>
          					               </Item.Header>
                					         <Item.Description>Number of Followers: {this.state.followers}</Item.Description>
                					         <Item.Description>Number of Recipes: {this.state.length}</Item.Description>
                               </Item.Content>
  					               </Item>
  					           </Item.Group>
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

export default UserDetails
