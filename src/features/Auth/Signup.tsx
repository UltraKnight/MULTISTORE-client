import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { UserSetter } from 'src/App';
import { login, signup } from '../../api';
import './Signup.css';

type SignupProps = {
  setCurrentUser: UserSetter;
};

export default function Signup({ setCurrentUser }: SignupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // REFACTOR: improve how form is handled
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const username = usernameRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';
    const fullName = nameRef.current?.value ?? '';
    const email = emailRef.current?.value ?? '';

    try {
      /* username, password, fullName, email */
      /**
       * lift up the state to app.js
       * setCurrentUser which is a prop
       */
      const response = await signup(username, password, fullName, email);
      if (response.data._id) {
        await login(username, password);
        setCurrentUser(response.data, () => {
          toast.success('Account created, you are logged in!');
          navigate('/');
        });
      } else {
        toast.error(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('An error occurred');
      console.log(`Error: ${error}`);
      setIsLoading(false);
    }
  };

  return !isLoading ? (
    <div className='container-fluid container-general'>
      <div className='text-center mt-3'>
        <img className='img-animated' src='/images/multistore-logo-small.png' width='300px' alt='multistore-logo' />
      </div>
      <div className='col-md-4 offset-md-4'>
        <h2>Create Account</h2>
        {/* username, password, fullName, email */}
        <form onSubmit={handleFormSubmit}>
          <div className='mb-3'>
            <label className='form-label' htmlFor='name'>
              Name
            </label>
            <input
              className='form-control'
              placeholder='Your full name'
              type='text'
              name='name'
              id='name'
              ref={nameRef}
              required
            />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='email'>
              Email
            </label>
            <input
              className='form-control'
              placeholder='Email'
              type='email'
              name='email'
              id='email'
              ref={emailRef}
              required
            />
          </div>
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

          <button type='submit' className='btn btn-warning border border-dark'>
            Register
          </button>
          <span className='float-end'>
            Already have an account? Login{' '}
            <Link to='/login' className='link-info'>
              here
            </Link>
          </span>
        </form>
      </div>
    </div>
  ) : (
    <div className='text-center'>
      <h2>Creating your account...</h2>
    </div>
  );
}
