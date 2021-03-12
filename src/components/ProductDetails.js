import React, {useEffect, useState, useRef} from 'react';
import {getProduct, addToCart, loggedin, getRates, addRate, deleteRate} from '../api';
import {toast} from 'react-toastify';

export default function ProductDetails({match, history}) {
    const {productId} = match.params;
    const [product, setProduct] = useState({});
    const [loggedInUser, setLoggedInUser] = useState({});
    const [rates, setRates] = useState([]);
    const [myRate, setMyRate] = useState(null);

    const commentRef = useRef();
    const rateRef = useRef();

    useEffect(() => {
        async function fetchData() {
            //get product
            let response = await getProduct(productId);
            setProduct(response.data);

            //get rates
            let ratesResponse = await getRates(response.data._id);
            setRates(ratesResponse.data);

            //get user
            let userResponse = await loggedin();
            if(userResponse.data._id) {
                setLoggedInUser(userResponse.data);

                //get user rate if exists
                let myRate = ratesResponse.data.find(rate => rate.createdBy._id === userResponse.data._id);
                setMyRate(myRate);
            }
        }

        fetchData();
    }, [productId])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
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

    const addRateSubmit = async (e) => {
        e.preventDefault();
        const comment = commentRef.current.value;
        let rate = rateRef.current.value;
        
        if(!comment || !rate) {
            toast.warning('Missing fields');
            return;
        }
        rate = rate > 5 ? 5 : rate < 1 ? 1 : rate;
        const createdBy = loggedInUser._id;
        const productId = product._id;
        const myRate = {comment, rate, createdBy, productId};
        
        try {
            const newRate = await addRate(myRate);
            const ratesArr = rates.concat(newRate.data);
            setRates(ratesArr);
            setMyRate(newRate.data);
            toast.success('Rate added to this product');
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteRate = async (id) => {
        await deleteRate(id);
        toast.success('Rate deleted');
        setMyRate(null);
        const response = await getRates(productId);
        setRates(response.data);
    }

    return product._id ? (
        <div className="container-fluid text-center">
            <div className="row mb-5">
                <div className="col-md-6 offset-md-3">
                <div className="card border-0 bg-transparent">
                    <div className="card-body">
                        <h2 className="card-title">{product.name}</h2>
                        <img className='mt-3 mb-3' width='250px' src={product.image_url} alt={product.name} />
                        <h2 className="card-title">&euro; {product.price.toFixed(2)}</h2>
                        <form className='mb-5' onSubmit={handleFormSubmit}>
                            <button className='btn btn-primary' type='submit'>Add to cart</button>
                        </form>

                        <h4>Description</h4>
                        <textarea readOnly rows='10' className="card-text text-start form-control bg-light border-0" value={product.description}></textarea>
                    </div>
                </div>
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6 offset-md-3 rounded-3 px-2 py-3' style={{backgroundColor: 'rgba(255, 244, 199, 0.3)'}}>
                    {<h3 className='text-start ms-4'>User rates for this product</h3>}
                    {
                        rates.length ? rates.map(rate => {
                            return (
                                <div key={rate._id}>
                                    <ul className='text-start' style={{listStyleType: 'none'}}>
                                        <li><strong>{rate.createdBy.username}</strong> - <strong>Rate: </strong>{rate.rate.toFixed(2)}</li>
                                        <li>{rate.comment}</li>
                                    </ul>
                                    <hr className='mx-3' />
                                </div>
                            )
                        })
                        : <p className='text-start ms-4'>None</p>
                    }
                    {
                        loggedInUser._id
                        ? myRate && myRate._id ?
                        <div className='text-start'>
                            <div className='d-flex align-items-center'>
                                <h3 className='ms-4 d-inline'>Your rate</h3>
                                <button onClick={() => handleDeleteRate(myRate._id)} className='btn btn-danger btn-sm ms-4'>X</button>
                            </div>
                            <ul style={{listStyleType: 'none'}}>
                                <li><strong>Rate: </strong>{myRate.rate.toFixed(2)}</li>
                                <li>{myRate.comment}</li>
                            </ul>
                        </div>
                        :
                        <form onSubmit={addRateSubmit}>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="prod-rate">Rate this product (1.0 to 5.0)</label>
                                <input step='0.1' ref={rateRef} min='1' max='5' className='form-control' type="number" name='prod-rate' id='prod-rate' required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="rate-comment">Comment</label>
                                <textarea style={{maxHeight: '200px'}} ref={commentRef} className="form-control" name="rate-comment" id="rate-comment" 
                                    placeholder="A nice comment about the product"></textarea>
                            </div>
                            <button type='submit' className='btn btn-warning'>Add rate</button>
                        </form>
                    : null}
                </div>
            </div> 
        </div>
    ) : null
}