import React, { Component } from 'react';
import { Route, Redirect} from 'react-router-dom';
import {loggedin} from '../api';

//High Order Component
export default class PrivateRouter extends Component {
    state = {
        isLoading: true,
        isLoggedIn: false
    }

    async componentDidMount() {
        const response = await loggedin();
        if(response.data._id) {
            this.setState({
                isLoading: false,
                isLoggedIn: true
            });
        } else {
            this.setState({
                isLoading: false,
                isLoggedIn: false
            });
        }
    }

    //render a component based on the received props
    render() {
        const {path, exact, component} = this.props;
        const {isLoggedIn, isLoading} = this.state;
        
        return isLoading ? null : isLoggedIn ? (
            <Route path={path} component={component} exact={exact} />
        ) : <Redirect to='/login' />                 
    }
}
