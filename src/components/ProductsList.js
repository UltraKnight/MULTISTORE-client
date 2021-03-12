import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {getProducts, getProductsByCategory} from '../api';

//can receive a category or query to filter the products
export default function ProductsList({match}) {
    const category = match.params.categoryId ? match.params.categoryId : null;
    const search = useLocation().search;
    const searchQuery = new URLSearchParams(search).get('query');
    const [products, setProducts] = React.useState([]);
    const [highlights, setHighlights] = React.useState([]);

    React.useEffect(() => {
        async function fetchData() {
            const response = searchQuery ? await getProducts(searchQuery) : category ? await getProductsByCategory(category) : await getProducts();
            
            setProducts(response.data);

            if(response.data.length) {
                let arr = [];
                for(let i = 1; i <= 3; i++) {
                    let index = Math.floor(Math.random() * response.data.length);
                    arr.push(response.data[index]);
                }
                setHighlights(arr);
            }
        }
        fetchData();
    }, [category, searchQuery]);

    return products.length ? (
        <>
        { highlights.length ?
        <div className='col-md-6 offset-md-3'>
            {/* carousel */}
            <div id="carouselHighlights" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselHighlights" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselHighlights" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselHighlights" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                    <Link to={`/products/${highlights[0]._id}`}><img src={highlights[0].image_url} className="d-block w-100 mx-auto" alt={highlights[0].name} /></Link>
                        <div className="carousel-caption d-none d-md-block pb-3">
                            <p className='pb-0 px-3 mb-1 mx-auto rounded' style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', width: 'fit-content'}}>{highlights[0].name}</p>
                            <Link to={`/products/${highlights[0]._id}`} className='btn btn-primary btn-small'>See product</Link>
                        </div>
                    </div>

                    <div className="carousel-item">
                    <Link to={`/products/${highlights[1]._id}`}><img src={highlights[1].image_url} className="d-block w-100 mx-auto" alt={highlights[1].name} /></Link>
                        <div className="carousel-caption d-none d-md-block pb-3">
                            <p className='pb-0 px-3 mb-1 mx-auto rounded' style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', width: 'fit-content'}}>{highlights[1].name}</p>
                            <Link to={`/products/${highlights[1]._id}`} className='btn btn-primary btn-small'>See product</Link>
                        </div>
                    </div>
                        <div className="carousel-item">
                        <Link to={`/products/${highlights[2]._id}`}><img src={highlights[2].image_url} className="d-block w-100 mx-auto" alt={highlights[2].name} /></Link>
                        <div className="carousel-caption d-none d-md-block pb-3">
                            <p className='pb-0 px-3 mb-1 mx-auto rounded' style={{backgroundColor: 'rgba(0, 0, 0, 0.4)', width: 'fit-content'}}>{highlights[2].name}</p>
                            <Link to={`/products/${highlights[2]._id}`} className='btn btn-primary btn-small'>See product</Link>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselHighlights"  data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselHighlights"  data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        : null}
        <div className='container-fluid d-flex flex-wrap justify-content-around pb-3'>
        {
        products.map(product => {
            return (
                product.quantity > 0 ? (
                <Link key={product._id} style={{textDecoration: 'none'}} to={`/products/${product._id}`}>
                <div className="card pt-3 bg-white border-0 text-center mt-2" style={{width: '20rem', height: '380px', boxShadow: '2px 2px 6px #888888'}}>
                    
                    <img
                    className="card-img-top img-fluid mx-auto"
                    src={product.image_url}
                    alt={product.name}
                    style={{maxHeight: '150px', width: 'auto'}}
                    />

                    <div className="card-body">
                        <h5 className="card-title">
                            <p>{product.name.length > 80 ? `${product.name.substring(0, 80)}...` : product.name}</p>
                        </h5>
                        <p className="card-text m-0"><small className='text-muted'>available: {product.quantity}</small></p>
                        <p className='card-text'><small className='text-muted'>From: {
                            (product.createdBy.billing.state ? product.createdBy.billing.state : 'n/a') +
                            (product.createdBy.billing.country ? ' - ' + product.createdBy.billing.country : '')
                        }</small></p>
                        <h4 className="card-text text-dark">&euro; {product.price.toFixed(2)}</h4>
                    </div>
                </div>
                </Link>
                ) : (
                <div key={product._id} className="card pt-3 bg-white border-0 text-center mt-2" style={{width: '20rem', height: '380px', boxShadow: '2px 2px 6px #888888'}}>
                    <img
                    className="card-img-top img-fluid mx-auto"
                    src='/images/multistore-logo.png'
                    alt=""
                    style={{maxHeight: '150px', width: 'auto'}}
                    />
                    <div className="card-body">
                        <h5 className="card-title">
                            {product.name}
                        </h5>
                        <p className="card-text"><small className='text-muted'>not available</small></p>
                        <h4 className="card-text">&euro; {product.price.toFixed(2)}</h4>
                    </div>
                </div>
                )
            )
        })
        }
        </div>
        </>
    ) : null
}