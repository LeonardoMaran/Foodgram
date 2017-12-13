import React, { Component } from 'react';
import { Input, Dropdown, Image, Grid, Divider} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../styles/users.css';

export class Users extends Component {

	constructor(props) {
        super(props);
        this.state = {
            currentUser: "samhanke",
            users: [],
            visible: [],
            searchBy: ""
        };
        this.searchUsers = this.searchUsers.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        getUsers()
            .then(function(response) {
                this.setState({users: response.data.data, visible: response.data.data});
            }.bind(this))
            .catch(function(error) {
                console.log(error);
        });
    }

    searchUsers(event) {
        var users = [];
        for(var i = 0; i < this.state.users.length; i++) {
          if(this.state.searchBy === "name") {
              if(this.state.users[i].name.toLowerCase().includes(event.currentTarget.value) && event.currentTarget.value !== '') {
                  users.push(this.state.users[i]);
              }
          } else {
              if(this.state.users[i].username.toLowerCase().includes(event.currentTarget.value) && event.currentTarget.value !== '') {
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

        return(
            <div className="Users">
                <h1>Users</h1>
                <div className="Search">
                    <Input className='search_bar' type='text' placeholder='Search users...' onChange={this.searchUsers} />
										<div className="SortBy">
									    	<p className="sort_text">Search By:</p>
		                    <Dropdown className='sort_menu' defaultValue={sortOptions[0].value} onChange={this.handleChange} search selection options={sortOptions} />
										</div>
								</div>
								<Divider section></Divider>
								<div className="Found">
										<Grid centered relaxed padded='vertically' padded='horizontally'
													verticalAlign='middle' columns='equal'>
												{ this.state.visible.map((user, index) => (
														<Link key={index} to={{ pathname: '/user/' + user.name,
																				param: {  user_id : user.id,
																									user_index : index
																							  }
																			}}>
																			<div className="User">
																					<div className="UserText">
																							<h2>{user.name}</h2>
																					</div>
																					<div className="UserImage">
																							<Image size='medium' src={user.profilePicUrl} />
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

function getUsers(){
    return axios({
        method: 'get',
        baseURL: 'http://localhost:4000/api/',
        url: 'users'
    });
}

export default Users
