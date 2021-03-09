import React, {useEffect, useState} from 'react';
import {getProduct, addToCart, loggedin} from '../api';
import {toast} from 'react-toastify';

export default function ProductDetails({match, history}) {
    const {productId} = match.params;
    const [product, setProduct] = useState();

    useEffect(() => {
        async function fetchData() {
            const response = await getProduct(productId);
            setProduct(response.data);
        }

        fetchData();
    }, [productId])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let loggedInUser = await loggedin();
        loggedInUser = loggedInUser.data;
        if(loggedInUser._id) {
            if(product.quantity > 0) {
                const productToCart = {product: product._id, quantity: 1};
                try {
                    const response = await addToCart(productToCart);
                    toast.success(response.data);
                } catch (error) {
                    console.log(error);
                }
            } else {
                toast.warning('you cannot buy an unavailable product');
            }
        } else {
            toast.warning('log in first and enjoy shopping ');
            history.push('/login');
        }
    }

    return product ? (
        <div className="container-fluid text-center">
            <div className="row">
                <div className="col-md-6 offset-3">
                <div className="card border-0 bg-transparent">
                    <div className="card-body">
                        <h2 className="card-title">{product.name}</h2>
                        <img className='mt-3 mb-3' width='250px' src={product.image_url} alt={product.name} />
                        <h4>Description</h4>
                        <p className="card-text text-start">{product.description}</p>
                        <h2 className="card-title">&euro; {product.price.toFixed(2)}</h2>

                        <form onSubmit={handleFormSubmit}>
                            <button className='btn btn-primary' type='submit'>Add to cart</button>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    ) : null
}