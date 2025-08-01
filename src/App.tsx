import './App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

//components
import Cart from './components/Cart';
import Checkout from './components/checkout/Checkout';
import ConfirmEmail from './components/ConfirmEmail';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Footer';
import Login from './components/Login';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import ProductDetails from './components/ProductDetails';
import ProductsList from './components/ProductsList';
import Profile from './components/Profile';
import Signup from './components/Signup';

//api
import { loggedin } from './api';
import type { User } from './types/user';

export type UserSetter = (user: User | null, callback?: () => void) => void;

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [basketQuantity, setBasketQuantity] = useState<number>(0);
  const pendingCallbackRef = useRef<(() => void) | null>(null); // if there is a callback to run after user is updated

  //used to logout - setCurrentUser to null
  //or to login - setCurrentUser to the loggedin user
  const setCurrentUser: UserSetter = (user, callback) => {
    setLoggedInUser(user);
    if (callback) {
      pendingCallbackRef.current = callback; // store the callback to run later after the state is updated
    }
  };

  useEffect(() => {
    if (pendingCallbackRef.current) {
      pendingCallbackRef.current();
      pendingCallbackRef.current = null; // clear after running
    }

    const checkLoggedInState = async () => {
      if (loggedInUser === null) {
        //Check if the user session is still active on the server
        try {
          const response = await loggedin();
          if (response.data._id) {
            //there's an active user session on the server
            setCurrentUser(response.data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      setBasketQuantity(loggedInUser?.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0);
    };

    checkLoggedInState();
  }, [loggedInUser]);

  return loading ? (
    <>
      <div className='container-fluid container-general'>
        <div className='text-center mt-3'>
          <img className='img-animated' src='/images/multistore-logo-small.png' width='300px' alt='multistore-logo' />
        </div>
        <div className='text-center mt-5'>
          <div className='spinner-border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <h2>It may take more than 1 minute to start the services...</h2>
          <h2>Side effect of free host, be patient ☺️</h2>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <>
      <main>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<NavBar loggedInUser={loggedInUser} setCurrentUser={setCurrentUser} basketQuantity={basketQuantity} />}>
            <Route path='/' element={<ProductsList />}></Route>
            <Route path='/products/by-category/:categoryId' element={<ProductsList />}></Route>
            <Route path='/products/:productId' element={<ProductDetails setBasketQuantity={setBasketQuantity} />}></Route>
            <Route path='/products' element={<ProductsList />}></Route>
            <Route path='/confirm/:id' element={<ConfirmEmail />}></Route>
            <Route path='/cart' element={<PrivateRoute />}>
              <Route path='/cart' element={<Cart setBasketQuantity={setBasketQuantity} />}></Route>
            </Route>
            <Route path='/dashboard' element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />}></Route>
            </Route>
            <Route path='/profile' element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />}></Route>
            </Route>
            <Route path='/checkout' element={<PrivateRoute />}>
              <Route path='/checkout' element={<Checkout />}></Route>
            </Route>
            <Route path='/login' element={<Login setCurrentUser={setCurrentUser} />}></Route>
            <Route path='/signup' element={<Signup setCurrentUser={setCurrentUser} />}></Route>
          </Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
}
