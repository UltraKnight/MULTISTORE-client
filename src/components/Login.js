import React, {useRef} from 'react';
import {login} from '../api';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import './Login.css';

export default function Login({setCurrentUser, history}) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        try { 
            const response = await login(username, password);
            /**
             * lift up the state to app.js
             * setCurrentUser which is a prop
             */
            setCurrentUser(response.data);
            toast.success('Login success');
            history.push('/');
        } catch (error) {
            toast.error('Invalid Login');  
        }
    }

    return(
        <div className="container-fluid container-general">
            <div className='text-center mt-3'>
                <img className='img-animated' src="/images/multistore-logo-small.png" width="300px" alt="multistore-logo" />
            </div>
            <div className="col-md-4 offset-md-4">
                <h2>Login</h2>

                <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="username">Username</label>
                    <input className="form-control" type="text" name="username" id="username" ref={usernameRef} required />
                </div>
                    
                <div className="mb-3">
                    <label className="form-label" htmlFor="password">Password</label>
                    <input className="form-control" type="password" name="password" id="password" ref={passwordRef} required />
                </div>

                <button type="submit" className="btn btn-warning border border-dark">Login</button>
                <span className="float-end">Don't have an account? Sign up <Link to="/signup" className="link-info">here</Link></span>
                </form>
            </div>
        </div>
    )
}