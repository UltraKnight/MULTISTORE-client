import React, { Component } from 'react';
import { Outlet, Navigate} from 'react-router-dom';
import {loggedin} from '../api';

//High Order Component
export default class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoggedIn: false
        };
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
        // const {path, exact, component} = this.props;
        const {isLoggedIn, isLoading} = this.state;
        // return isLoading ? (<React.Fragment></React.Fragment>) : isLoggedIn ? (
        //     <Route path={path} component={component} exact={exact} />
        // ) : (<React.Fragment><Navigate to='/login' /></React.Fragment>)
        return isLoading ? null : isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
    }
}
