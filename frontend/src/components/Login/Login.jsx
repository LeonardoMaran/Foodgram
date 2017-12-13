import React, { Component } from 'react';
import {Input} from 'semantic-ui-react'
import axios from 'axios';

import '../../styles/login.css';

import Modal from '../Modal/Modal.jsx'

export class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {modalOpen: false, username: '', password: '', verify: '', name: ''};
		this.toggleModal = this.toggleModal.bind(this);
		this.handleUpdateUser = this.handleUpdateUser.bind(this);
		this.handleUpdateName = this.handleUpdateName.bind(this);
		this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
		this.handleUpdateVerify = this.handleUpdateVerify.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}


	toggleModal() {
		this.setState({modalOpen: !this.state.modalOpen});
	}

	handleUpdateUser(event) {
		this.setState({username: event.target.value});
	}

	handleUpdateName(event) {
		this.setState({name: event.target.value});
	}

	handleUpdatePassword(event) {
		this.setState({password: event.target.value});
	}

	handleUpdateVerify(event) {
		this.setState({verify: event.target.value});
	}


	handleLogin(event) {
		axios.post('http://localhost:4000/api/auth/login', {
			  username: this.state.username,
			  password: this.state.password
			})
			.then(function(response) {
				// Log response
				console.log(response.data.message);

				this.props.handler(this.state.username);

			}.bind(this))
			.catch(function(error) {
				// Log response
				console.log(error);
			});
	}

	handleRegister(event) {
		if (this.state.password === this.state.verify) {
			axios.post('http://localhost:4000/api/auth/register', {
			  name: this.state.name,
			  username: this.state.username,
			  password: this.state.password
			})
			.then(function(response) {

				console.log(response.data.message);

				this.props.handler(this.state.username);

			}.bind(this))
			.catch(function(error) {
				// Log response
				console.log(error);
			});
		}
	}

    render() {
        return(
            <div className="Login">
                <div className="Main">
                	<h1>Foodgram</h1>
	                <div className="ui input"><Input type="text" value={this.state.username} onChange={this.handleUpdateUser} placeholder="Username"/></div><br/>
	                <div className="ui input"><Input type="password" value={this.state.password} onChange={this.handleUpdatePassword} placeholder="Password"/></div><br/>
	                <button className="LoginButton ui primary button" onClick = {this.handleLogin.bind(this)}>Log In</button>
                </div>

                <div className="Register">
                	<p>Need an account?</p>
                	<button className="RegisterButton ui primary button" onClick={this.toggleModal}>Sign Up</button>
                </div>

                <Modal show={this.state.modalOpen} onClose={this.toggleModal}>
                	<div className="Modal">
	                	<div className="ui input"><input type="text" value={this.state.name} onChange={this.handleUpdateName} placeholder="Full Name"/></div><br/>
		                <div className="ui input"><input type="text" value={this.state.username} onChange={this.handleUpdateUser} placeholder="Username"/></div><br/>
		                <div className="ui input"><input type="password"  value={this.state.password} onChange={this.handleUpdatePassword} placeholder="Password"/></div><br/>
		                <div className="ui input"><input type="password" value={this.state.verify} onChange={this.handleUpdateVerify} placeholder="Verify Password"/></div><br/>
		                <button className="SignupButton ui primary button" onClick = {this.handleRegister.bind(this)}>Sign Up</button>
                	</div>
                </Modal>

            </div>
        );
    }
}

export default Login
