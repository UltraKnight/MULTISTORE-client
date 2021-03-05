import React from 'react';
import {toast} from 'react-toastify';
import {logout} from '../api';

export default function NavBar({loggedInUser, setCurrentUser}) {
    const logoutUser = async () => {
        const response = await logout();
        setCurrentUser(null);
        toast.success(response.data);
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-warning">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"><img src="/images/multistore-navbar-logo-transparent.png" height='35px' alt="multistore logo"/></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Dropdown
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a className="dropdown-item" href="#">Action</a></li>
                            {loggedInUser ? (
                                <>
                                <li>loggedin</li>
                                <li>loggedin</li>
                                </>
                            ):
                            (
                                <li>loggedout</li>
                            )}
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                        </li>
                        <li style={{position: 'relative'}}>
                            <form className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Search for a product" aria-label="Search" />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                            <div className="container-fluid p-0 d-none" style={{position: 'absolute', top: '50px', width: '300px'}}>
                                <div className='me-2'>
                                    <div className="list-group" id="list-tab" role="tablist">
                                        <a className="list-group-item list-group-item-action list-group-item-warning active" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="home">Home</a>
                                        <a className="list-group-item list-group-item-action list-group-item-warning" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="profile">Profile</a>
                                        <a className="list-group-item list-group-item-action list-group-item-warning" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="messages">Messages</a>
                                        <a className="list-group-item list-group-item-action list-group-item-warning" id="list-settings-list" data-bs-toggle="list" href="#list-settings" role="tab" aria-controls="settings">Settings</a>
                                    </div>
                                </div>
                                <div>
                                    <div className="tab-content" id="nav-tabContent">
                                        <div className="tab-pane fade show active" id="list-home" role="tabpanel" aria-labelledby="list-home-list">
                                            <div className="container-fluid p-0 d-flex flex-column" style={{maxWidth: '300px'}}>
                                                <div className='me-1'>
                                                    <img width='80px' src='/images/multistore-logo.png' alt="..." />
                                                </div>
                                                <div style={{height: '200px', width: '180px', fontSize: '0.8rem'}}>
                                                    <h5 className="card-title">Product name lksdjflçasjflçkajslçfkjasçlfkjds</h5>
                                                    <p className="card-text" style={{overflowY: 'scroll', height: '100px'}}>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                    <p className="card-text"><small className="text-muted">Price</small></p>
                                                    <a href="" className='btn btn-primary btn-sm'>View Product</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">
                                            <div className="container-fluid p-0 d-flex flex-column" style={{maxWidth: '300px'}}>
                                                <div className='me-1'>
                                                    <img width='80px' src='/images/multistore-logo.png' alt="..." />
                                                </div>
                                                <div style={{height: '200px', width: '180px', fontSize: '0.8rem'}}>
                                                    <h5 className="card-title">Product name</h5>
                                                    <p className="card-text" style={{overflowY: 'scroll', height: '100px'}}>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                    <p className="card-text"><small className="text-muted">Price</small></p>
                                                    <a href="" className='btn btn-primary btn-sm'>View Product</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">
                                            <div className="container-fluid p-0 d-flex flex-column" style={{maxWidth: '300px'}}>
                                                <div className='me-1'>
                                                    <img width='80px' src='/images/multistore-logo.png' alt="..." />
                                                </div>
                                                <div style={{height: '200px', width: '180px', fontSize: '0.8rem'}}>
                                                    <h5 className="card-title">Product name</h5>
                                                    <p className="card-text" style={{overflowY: 'scroll', height: '100px'}}>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                    <p className="card-text"><small className="text-muted">Price</small></p>
                                                    <a href="" className='btn btn-primary btn-sm'>View Product</a>
                                                </div>
                                            </div>  
                                        </div>
                                        <div className="tab-pane fade" id="list-settings" role="tabpanel" aria-labelledby="list-settings-list">
                                            <div className="container-fluid p-0 d-flex flex-column" style={{maxWidth: '300px'}}>
                                                <div className='me-1'>
                                                    <img width='80px' src='/images/multistore-logo.png' alt="..." />
                                                </div>
                                                <div style={{height: '200px', width: '180px', fontSize: '0.8rem'}}>
                                                    <h5 className="card-title">Product name</h5>
                                                    <p className="card-text" style={{overflowY: 'scroll', height: '100px'}}>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                    <p className="card-text"><small className="text-muted">Price</small></p>
                                                    <a href="" className='btn btn-primary btn-sm'>View Product</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}