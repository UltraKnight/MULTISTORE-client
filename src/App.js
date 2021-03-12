import './App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'react-toastify/dist/ReactToastify.css';

import {ToastContainer} from 'react-toastify'
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

//components
import NavBar from './components/NavBar';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductsList from './components/ProductsList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard/Dashboard';
import Checkout from './components/checkout/Checkout';
import ConfirmEmail from './components/ConfirmEmail';
import Footer from './components/Footer';

//api
import {loggedin} from './api';

export default class App extends Component {
  state = {
    loggedInUser: null,
  }

  //used to logout - setCurrentUser to null
  //or to login - setCurrentUser to the loggedin user
  setCurrentUser = (user, callback) => {    
    this.setState({
      loggedInUser: user
    }, callback
  )}

  async componentDidMount() {
    if(this.state.loggedInUser === null) {
      //Check if the user session is still active on the server
      try {
        const response = await loggedin();
        if(response.data._id) {
          //there's an active user session on the server
          this.setCurrentUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    const {loggedInUser} = this.state;
    return (
      <>
      <div style={{minHeight: '100vh'}} className="App container-fluid m-0 p-0 bg-light">
        <ToastContainer />
        <Route render={(props) => {
            return <NavBar {...props} loggedInUser={loggedInUser} setCurrentUser={this.setCurrentUser} />
          }} />
        <Switch>
          <Route exact path='/' component={ProductsList} />
          <Route exact path='/products/by-category/:categoryId' component={ProductsList} />
          <Route exact path='/products/:productId' component={ProductDetails} />
          <Route exact path='/products' component={ProductsList} />
          <Route exact path='/confirm/:id' component={ConfirmEmail} />
          <PrivateRoute exact path='/cart' component={Cart} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/profile' component={Profile} />
          <PrivateRoute exact path='/checkout' component={Checkout} />

          <Route exact path='/login' render={
            (props) => {
              return <Login {...props} setCurrentUser={this.setCurrentUser} />
          }} />
          <Route exact path='/signup' render={
            (props) => {
              return <Signup {...props} setCurrentUser={this.setCurrentUser} l={loggedInUser} />
          }} />
        </Switch>
      </div>
      <Footer />
      </>
    );
  }
}