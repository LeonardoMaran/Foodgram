import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Input} from 'semantic-ui-react'
import ReactModal from 'react-modal';
// import { } from 'semantic-ui-react';

import styles from '../../styles/login.css';
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
	}


	toggleModal() {
		this.setState({modalOpen: !this.state.modalOpen});
	}


    render() {
        return(
            <div className="Login">
                <h1>Log In</h1>
                <div className="Main">
	                <div className="ui input"><Input type="text" value={this.state.username} onChange={this.handleUpdateUser} placeholder="Username"/></div><br/>
	                <div className="ui input"><Input type="text" value={this.state.password} onChange={this.handleUpdatePassword} placeholder="Password"/></div><br/>
	                <button className="ui primary button">Log In</button>
                </div>

                <div className="Register">
                	<p>Need an account?</p>
                	<button className="ui primary button" onClick={this.toggleModal}>Sign Up</button>
                </div>

                <Modal show={this.state.modalOpen} onClose={this.toggleModal}>
                	<div className="Modal">
                	<div className="ui input"><input type="text" value={this.state.name} onChange={this.handleUpdateName} placeholder="Full Name"/></div><br/>
	                <div className="ui input"><input type="text" value={this.state.username} onChange={this.handleUpdateUser} placeholder="Username"/></div><br/>
	                <div className="ui input"><input type="text"  value={this.state.password} onChange={this.handleUpdatePassword} placeholder="Password"/></div><br/>
	                <div className="ui input"><input type="text" value={this.state.password} onChange={this.handleUpdateVerify} placeholder="Verify Password"/></div><br/>
	                <button className="ui primary button">Sign Up</button>
                </div>
                </Modal>

            </div>
        );
    }
}

export default Login
