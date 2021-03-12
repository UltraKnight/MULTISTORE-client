import './NavBar.css';
import React from 'react';
import {toast} from 'react-toastify';
import {logout, getAllCategories, getProducts} from '../api';
import { NavLink, Link } from 'react-router-dom';
import { MdShoppingCart } from "react-icons/md";
import { IconContext } from 'react-icons';

export default function NavBar({loggedInUser, setCurrentUser, history}) {
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const searchRef = React.useRef();
    const [firstThreeFromSearch, setFirstThreeFromSearch] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const response = await getAllCategories();
            setCategories(response.data);
        }
        fetchData();
    }, []);

    const updateCategories = async () => {
        setLoading(true);
        const response = await getAllCategories();
        setCategories(response.data);
        setLoading(false);
    }

    const logoutUser = async () => {
        const response = await logout();
        setCurrentUser(null);
        toast.success(response.data);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const search = searchRef.current.value;

        history.push(`/products?query=${search}`);
        searchRef.current.value = '';
        setFirstThreeFromSearch([]);
    }

    const handleClick = () => {
        searchRef.current.value = '';
        setFirstThreeFromSearch([]);
    }

    const handleChange = async () => {
        const search = searchRef.current.value;
        if(search) {
            const response = await getProducts(search, 6, 'true');
            setFirstThreeFromSearch(response.data);
        } else {
            setFirstThreeFromSearch([]);
        }
    }

    return categories.length ? (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-warning">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/"><img src="/images/multistore-navbar-logo-transparent.png" height='35px' alt="multistore logo"/></a>
                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <button onFocus={updateCategories} className="nav-link dropdown-toggle btn btn-link shadow-none" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Categories
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {
                                    // if not loading and categories has a length
                                    !loading ? categories.length ?
                                    categories.map(category => {
                                        return (
                                            <li key={category._id}><NavLink className="dropdown-item" to={`/products/by-category/${category._id}`}>{category.name}</NavLink></li>
                                        )
                                    })
                                    :<li>Nothing to show</li>
                                    :<li>Loading...</li>
                                }
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                        </li>
                        {
                            loggedInUser ? (
                                <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/profile">Profile</NavLink>
                                </li>
                                </>
                            )
                            : (
                               null
                            )
                        }
                        <li className='nav-item' style={{position: 'relative'}}>
                            <form className="d-flex" onSubmit={handleFormSubmit}>
                                <input className="form-control me-2" type="text" placeholder="Search for a product" aria-label="Search" onKeyUp={handleChange} ref={searchRef} />
                                <button className="btn btn-outline-dark" type='submit'>Search</button>
                            </form>
                            <div className={(firstThreeFromSearch.length ? 'd-block' : 'd-none') + ' m-0 p-0 custom-width border bg-white'}
                                style={{position: 'absolute', top: '50px', zIndex: '50'}}>
                                <div className='me-2 p-0 custom-display mb-2' style={{width: '130px'}}>
                                    <div className="list-group" id="list-tab" role="tablist">
                                    {
                                        firstThreeFromSearch.map((product, index) => {
                                            return(
                                                <a key={product._id} className={"p-1 list-group-item list-group-item-action list-group-item-light rounded-0 border-0" + (index === 0 ? ' active' : '')} id={`list-${index}-list`} data-bs-toggle="list" href={`#list-${index}`} role="tab" aria-controls={product.name}>
                                                    {product.name.length > 15 ? product.name.substr(0, 15) + '...' : product.name}
                                                </a>
                                            )
                                        })
                                    }
                                    </div>
                                </div>

                                <div className='p-0 m-0 custom-display' style={{width: '300px'}}>
                                    <div className="tab-content" id="nav-tabContent">
                                    {
                                        firstThreeFromSearch.map((product, index) => {
                                            return (
                                            <div key={product._id} className={"tab-pane fade show" + (index === 0 ? ' active' : '')} id={`list-${index}`} role="tabpanel" aria-labelledby={`list-${index}-list`}>
                                                <div className="container-fluid p-0 d-flex flex-column">
                                                    <div className='me-1'>
                                                        <img width='80px' src='/images/multistore-logo.png' alt="..." />
                                                    </div>
                                                    <div className='text-wrap' style={{height: '200px', fontSize: '0.8rem', overflowY: 'hidden'}}>
                                                        <Link style={{textDecoration: 'none'}} to={`/products/${product._id}`} className="card-title fs-5">{product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}</Link>
                                                        <p className="card-text">{product.description.length > 180 ? product.description.substring(0, 180) + '...'
                                                            : product.description.substring(0, 180)}</p>
                                                        <p className="card-text">&euro; {product.price}</p>
                                                        <Link to={`/products/${product._id}`} onClick={handleClick} className='btn btn-primary btn-sm ms-1'>View Product</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            </div>
                        </li>
                        {
                            loggedInUser ? (
                                <>
                                <li className="d-flex align-items-center custom-margin nav-item">
                                    <div className="me-2 nav-picture" style={{backgroundImage: `url(${loggedInUser.profile_picture})`}}></div>
                                    <span className="me-3">Hey {loggedInUser.username}</span>
                                </li>
                                <li className='nav-item' id='cart'>
                                    <IconContext.Provider value={{color: 'black', size: '3rem' }}>
                                        <NavLink to='/cart'><MdShoppingCart /></NavLink>
                                    </IconContext.Provider>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className="nav-link" to="/">
                                        <button className="btn btn-outline-danger border-0 pb-0 pt-0" type="button" onClick={logoutUser} id="logout">Logout</button>
                                    </NavLink>
                                </li>
                                </>
                            ) : (
                                <>
                                <li className="nav-item">
                                    <NavLink className="nav-link custom-margin" to='/login'>Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to='/signup'>Signup</NavLink>
                                </li>
                                </>
                            )
                        }
                    </ul>
                    </div>
                </div>
            </nav>
        </div>
    ) : null
}