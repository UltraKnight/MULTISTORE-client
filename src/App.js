import './App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'react-toastify/dist/ReactToastify.css';

import {ToastContainer} from 'react-toastify';
import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';

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
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
    };

    this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  //used to logout - setCurrentUser to null
  //or to login - setCurrentUser to the loggedin user
  setCurrentUser(user, callback) {    
    this.setState({ loggedInUser: user }, callback);
  }

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
      <main>
        <ToastContainer />
        <Routes>
          {/* <Route render={(props) => {
            return <NavBar {...props} loggedInUser={loggedInUser} setCurrentUser={this.setCurrentUser} />
          }} /> */}
          <Route path='/' element={<NavBar loggedInUser={loggedInUser} setCurrentUser={this.setCurrentUser} />}>
            <Route exact path='/' element={<ProductsList />}></Route>
            <Route exact path='/products/by-category/:categoryId' element={<ProductsList />}></Route>
            <Route exact path='/products/:productId' element={<ProductDetails />}></Route>
            <Route exact path='/products' element={<ProductsList />}></Route>
            <Route exact path='/confirm/:id' element={<ConfirmEmail />}></Route>
            <Route exact path='/cart' element={<PrivateRoute />}>
              <Route exact path='/cart' element={<Cart />}></Route>
            </Route>
            <Route exact path='/dashboard' element={<PrivateRoute />}>
              <Route exact path='/dashboard' element={<Dashboard />}></Route>
            </Route>
            <Route exact path='/profile' element={<PrivateRoute />}>
              <Route exact path='/profile' element={<Profile />}></Route>
            </Route>
            <Route exact path='/checkout' element={<PrivateRoute />}>
              <Route exact path='/checkout' element={<Checkout />}></Route>
            </Route>
          {/* <Route exact path='/login' render={
            (props) => {
              return <Login {...props} setCurrentUser={this.setCurrentUser} />
          }} /> */}
            <Route exact path='/login' element={<Login setCurrentUser={this.setCurrentUser} />}></Route>
            <Route exact path='/signup' element={<Signup setCurrentUser={this.setCurrentUser} l={loggedInUser} />}></Route>
          </Route>
        </Routes>
      </main>
      <Footer />
      </>
    );
  }
}