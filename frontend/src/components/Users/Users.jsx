import React, { Component } from 'react';
import { Input, Dropdown, Image, Grid, Divider} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/users.css';

export class Users extends Component {

	constructor(props) {
        super(props);
        this.state = {
            currentUserId: props.user,
            users: [],
            visible: [],
            following: [],
            searchBy: "name"
        };
        this.searchUsers = this.searchUsers.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.followClick = this.followClick.bind(this);
        this.unfollowClick = this.unfollowClick.bind(this);
    }

    componentWillMount(){
        getUsers()
            .then(function(response) {
                this.setState({users: response.data.data, visible: response.data.data});
            }.bind(this))
            .catch(function(error) {
                console.log(error);
        });
        const url = 'http://104.131.161.44:4000/api/users/following/' + this.props.user;
        axios.get(url)
            .then(function(response) {
                this.setState({following: response.data.data});
            }.bind(this))
            .catch(function(error) {
                console.log(error);
        });
    }

    searchUsers(event) {
        var users = [];
        for(var i = 0; i < this.state.users.length; i++) {
          if(this.state.searchBy === "name") {
              if(this.state.users[i].name.toLowerCase().includes(event.currentTarget.value.toLowerCase())
                  && event.currentTarget.value !== '') {
                  users.push(this.state.users[i]);
              }
          } else {
              if(this.state.users[i].username.toLowerCase().includes(event.currentTarget.value.toLowerCase())
                  && event.currentTarget.value !== '') {
                  users.push(this.state.users[i]);
              }
          }
        }
        if(users.length === 0 && event.currentTarget.value === "") {
            this.setState({visible: this.state.users});
        } else {
            this.setState({visible: users});
        }
    }

    handleChange(e, { value }) {
        switch (value) {
          case "name":
            this.setState({searchBy: value});
            break;
          case "username":
            this.setState({searchBy: value});
            break;
          default:

        }
    }

    followClick(idx, e) {
        e.stopPropagation();

        let followUser = this.state.visible[idx];
        let followUserId = followUser._id;
        // follow user
        let url = 'http://104.131.161.44:4000/api/users/follow/' + this.state.currentUserId;
        axios.put(url, {
            followingId: followUserId
        }).then(function(response) {
            // Log response
            let user = response.data.data;
						this.setState({
								following : user.following
						});
        }.bind(this))
            .catch(function(error) {
                // Log response
                console.log(error);
            });
    }

    unfollowClick(idx, e) {
        e.stopPropagation();

        let unfollowUser = this.state.visible[idx];
        let unfollowUserId = unfollowUser._id;
        // unfollow user
        // follow user
        let url = 'http://104.131.161.44:4000/api/users/unfollow/' + this.state.currentUserId;
        axios.put(url, {
            followingId: unfollowUserId
        }).then(function(response) {
					let user = response.data.data;
					this.setState({
							following : user.following
					});
        }.bind(this))
            .catch(function(error) {
                // Log response
                console.log(error);
            });
    }

    render() {
    	const sortOptions = [
            {
              text: 'Name',
              value: 'name'
            },
            {
              text: 'Username',
              value: 'username'
            }
        ];

    	let userCards =
            this.state.visible.map((user, index) => {
    	        if (user._id === this.state.currentUserId) {
    	            // This user should not be shown
    	            return;
                }

                let userId = user._id;
                let followUserDiv;
                if (this.state.following.indexOf(userId) !== -1) {
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
																								curr_user_id: this.state.currentUserId
																						}}}>
																					<h2>{user.name}</h2>
																</Link>
                            </div>
                            <div className="UserImage">
															<Link key={index} style={{color: 'white'}}
																		to={{ pathname: '/user_details',
																					param: {
																							user_id: user._id,
																							curr_user_id: this.state.currentUserId
																					}}}>
                                		<Image size='medium' src={user.profilePicUrl} />
															</Link>
                            </div>
                        </div>
										</div>
                )
            });

        return(
            <div className="Users">
                <h1>Users</h1>
                <div className="Search">
                    <Input className='search_bar'
                           type='text'
                           placeholder='Search users...'
                           onChange={this.searchUsers} />
                    <div className="SortBy">
                        <p className="sort_text">Search By:</p>
		                    <Dropdown
                                className='sort_menu'
                                defaultValue={sortOptions[0].value}
                                onChange={this.handleChange} search selection
                                options={sortOptions} />
                    </div>
                </div>
                <Divider section></Divider>
                <div className="Found">
                        <Grid centered
                              relaxed
                              padded='vertically'
                              verticalAlign='middle'
                              columns='equal'>
                            {userCards}
                        </Grid>
                    </div>
            </div>
        );
    }
}

function getUsers(){
    return axios({
        method: 'get',
        baseURL: 'http://104.131.161.44:4000/api/',
        url: 'users'
    });
}

export default Users
