import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';

export default class App extends Component {
  state = {
    loggedInUser: null
  }

  //used to logout - setCurrentUser to null
  //or to login - setCurrentUser to the loggedin user
  setCurrentUser = (user) => {
    this.setState({
      loggedInUser: user
    });
  }

  render() {
    const loggedInUser = this.state;
    return (
      <div className="App">
        <ToastContainer />
        <NavBar loggedInUser={loggedInUser} setCurrentUser={this.setCurrentUser} />
        <Switch>
          <Route exact path='/' />
        </Switch>
      </div>
    );
  }
}