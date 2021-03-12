import React, { useEffect, useState } from 'react';
import {addToCart, removeFromCart, loggedin} from '../api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cart() {
    const [user, setUser] = useState([]);
    const [canFinish, setCanFinish] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            let response = await loggedin();
            if(response.data._id) {
                setUser(response.data);

                let deletedFound = false;
                for(const item of response.data.cart) {
                    if(item.product) {
                        if(item.quantity > item.product.quantity) {
                            await removeFromCart({product: item.product._id, quantity: (item.quantity - item.product.quantity)});
                            response = await loggedin();
                            setUser(response.data);
                        }
                    } else if(! item.product) {
                        deletedFound = true;
                        break;
                    }
                }

                setCanFinish(!deletedFound && response.data.emailConfirmed);
            }
        }
        fetchData();
    }, [])

    const handleAddRemove = async (e, id, quantity, available) => {
        e.preventDefault();
        setIsLoading(true);

        if(quantity === available && e.target.name === 'frmAdd') {
            toast.warning('reached the maximum available');
            setIsLoading(false);
            return;
        }

        const product = {product: id, quantity: e.target.name === 'frmRemove' ? 0 : 1}
        try {
            let response = e.target.name === 'frmAdd' ? await addToCart(product) : await removeFromCart(product);
            
            if(id === null) {
                toast.success('The unavailable product was removed');
            }

            response = await loggedin();
            if(response.data._id) {
                setUser(response.data);

                let deletedFound = false;
                for(const item of response.data.cart) {
                    if(! item.product) {
                        deletedFound = true;
                        break;
                    }
                }
                setCanFinish(! deletedFound);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }

    return user.cart && user.cart.length ? (
        <div className='table-responsive-md'>
            <table className="table table-borderless text-center">
            <thead>
                <tr className="fs-6">
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Remove</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {
                    user.cart.map(item => {
                        return (
                        <tr key={item._id} className="align-middle fs-6">
                            {
                                item.product || (item.product && item.product.quantity === 0)
                                ?
                                <td className="fw-bold text-start">
                                    <img className='me-2' src={item.product.image_url} alt={item.product.name} height="50px" />
                                    {item.product.name}
                                </td>
                                :<td className="fw-bold text-start">This product is no longer available, please remove from your cart</td>
                            }
                            <td>
                                {
                                    item.product && canFinish
                                    ?<div className='d-flex justify-content-center'>
                                        {!isLoading ? 
                                            <>
                                            <form name='frmRemoveOne' className="d-flex" onSubmit={(e) => handleAddRemove(e, item.product._id ,item.quantity, item.product.quantity)}>
                                                <button style={{width: '30px', zIndex: '2'}} className="btn btn-outline-dark btn-sm" type='submit'>-</button>
                                            </form>
                                            <input className='border-0 text-center' style={{width: '50px'}} type="text" min='1' max='99' value={item.quantity} readOnly />
                                            <form name='frmAdd' className="d-flex" onSubmit={(e) => handleAddRemove(e, item.product._id, item.quantity, item.product.quantity)}>
                                                <button style={{width: '30px', zIndex: '2'}} className="btn btn-outline-dark btn-sm" type='submit'>+</button>
                                            </form>
                                            </>
                                        : <span>Working...</span>}
                                    </div>
                                    : null
                                }
                            </td>
                            <td>
                                <form name='frmRemove' onSubmit={(e) => handleAddRemove(e, item.product ? item.product._id : null)}>
                                    <button type="submit" className="btn btn-sm btn-danger">X</button>
                                </form>
                            </td>

                            <td>
                                {
                                    item.product
                                    ?<>&euro; {(item.quantity * item.product.price).toFixed(2)}</>
                                    : null
                                }
                            </td>
                        </tr>
                        )
                    })
                }
                <tr>
                    <td></td>
                    <td></td>
                    <td>Total:</td>
                    {canFinish ? (<td>&euro; {user.cart.reduce((accumulator, curr) => accumulator + curr.quantity * curr.product.price, 0).toFixed(2)}</td>) : null}
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{canFinish ? <Link to='/checkout' className='btn btn-success'>Checkout</Link> : null}</td>
                </tr>
            </tbody>
            </table>
            {user.emailConfirmed ? null : <p className='text-center'>Please, confirm your email before proceed. <Link to='/profile'>Go to profile</Link></p>}
        </div>
    ) : (
        <div className='text-center'>
            <h4>Your cart is empty</h4>
            <Link to='/products' className='btn btn-success'>Keep shopping</Link>
        </div>
    )
}