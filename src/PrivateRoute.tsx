import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { loggedin } from './api';

//High Order Component
export default function PrivateRoute() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    const checkLoggedInState = async () => {
      const response = await loggedin();
      if (response.data._id) {
        setIsLoading(false);
        setIsLoggedIn(true);
      } else {
        setIsLoading(false);
        setIsLoggedIn(false);
      }
    };
    checkLoggedInState();
  }, []);

  return isLoading ? null : isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
}
