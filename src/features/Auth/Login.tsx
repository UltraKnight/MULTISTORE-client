import { isAxiosError } from 'axios';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { User } from 'src/types/user';
import { login } from '../../api';
import './Login.css';

export default function Login({ setCurrentUser }: { setCurrentUser: (user: User) => void }) {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const username = usernameRef.current!.value;
    const password = passwordRef.current!.value;

    try {
      const response = await login(username, password);
      /**
       * lift up the state to app.js
       * setCurrentUser which is a prop
       */
      setCurrentUser(response.data);
      toast.success('Login success');
      navigate('/');
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 429) {
        toast.error('Too many requests, try again later');
        return;
      }

      toast.error('Invalid Login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container-fluid container-general'>
      <div className='text-center mt-3'>
        <img className='img-animated' src='/images/multistore-logo-small.png' width='300px' alt='multistore-logo' />
      </div>
      <div className='col-md-4 offset-md-4'>
        <h2>Login</h2>

        <form onSubmit={handleFormSubmit}>
          <div className='mb-3'>
            <label className='form-label' htmlFor='username'>
              Username
            </label>
            <input className='form-control' type='text' name='username' id='username' ref={usernameRef} required />
          </div>

          <div className='mb-3'>
            <label className='form-label' htmlFor='password'>
              Password
            </label>
            <input className='form-control' type='password' name='password' id='password' ref={passwordRef} required />
          </div>

          <button type='submit' className='btn btn-warning border border-dark' disabled={isLoading}>
            Login
          </button>
          <span className='float-end'>
            Don't have an account? Sign up{' '}
            <Link to='/signup' className='link-info'>
              here
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}
