import React, { useEffect, useRef, useState } from 'react';
import  { getPurchases, addComment } from '../../api';
import { toast } from 'react-toastify';
import RetryForm from '../checkout/RetryForm';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const promise = loadStripe("pk_test_51IT8KtGAKMDxiOOthGn4JxLjLfAY5gd8cgA1zzkQg4E1Y2M6XbtJUwdbh7Xwjx5KFBtOMtAcDse6FG9wtEjDfaak00w0kzF5rU");

export default function SalesTab({activeTab}) {
    const [loading, setLoading] = useState(true);
    const [retry, setRetry] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState({});
    const [seller, setSeller] = useState('');
    const commentRef = useRef();

    useEffect(() => {
        async function fetchData() {
            let response = await getPurchases();
            setPurchases(response.data);
            setSeller('');
            setLoading(false);
            setRetry(false);
        }
        fetchData();
    }, []);

    const handlePurchaseClick = (e) => {
        const {id} = e.target;
        const foundPurchase = purchases.find(item => item._id === id);
        setSelectedPurchase(foundPurchase);
    }

    const handleAddCommentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const comment = commentRef.current.value;
        
        if(!comment) {
            toast.warning('Add a comment...');
            setLoading(false);
            return;
        }

        if(!seller) {
            toast.warning('Select the recipient');
            setLoading(false);
            return;
        }

        try {
            await addComment(selectedPurchase._id, seller, comment);
            toast.success('Comment published');

            let response = await getPurchases();
            setPurchases(response.data);

            const updatedPurchase = response.data.find(item => item._id === selectedPurchase._id);
            setSelectedPurchase(updatedPurchase);
            setSeller('');

            e.target.reset();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleSellerChange = (e) => {
        setSeller(e.target.value);
    }

    return !loading ? (
        retry ?
        <Elements stripe={promise}>
            <RetryForm total={selectedPurchase.total} orderId={selectedPurchase._id} retry={retry} setRetry={setRetry} setPurchases={setPurchases} setSelectedPurchase={setSelectedPurchase} />
        </Elements>
        :
        <div className={`tab-pane fade ${activeTab === 2 ? 'show active' : ''}`} id="purchases" role="tabpanel" aria-labelledby="purchases-tab">
            <div className='row'>
                <div className='col-md-3 my-3'>
                    <div className='mb-3'>
                        <button className="btn btn-sm btn-warning shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePurchases" aria-expanded="false" aria-controls="collapsePurchases">
                            My Purchases
                        </button>
                        <div className="collapse mt-3 show" id="collapsePurchases">
                            <ul className="list-group">
                                {
                                    purchases.length
                                    ? purchases.map(purchase => {
                                        return (
                                        <li key={purchase._id} id={purchase._id} role='button' onClick={handlePurchaseClick}
                                            className={`list-group-item d-flex justify-content-between align-items-center list-custom ${selectedPurchase && (purchase._id === selectedPurchase._id ? 'active' : '')}`}>
                                            {`id: ${purchase._id} - ${purchase.products.length} product(s) - ${new Date(purchase.orderDate).toLocaleDateString()}`}
                                        </li>
                                        )
                                    })
                                    : <li>Nothing here</li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-7 my-3">
                {
                    selectedPurchase && selectedPurchase._id ?
                    <>
                        <h3>Purchase details</h3>
                        <h5>Products</h5>
                        {
                            selectedPurchase.products.map(product => {
                                return (
                                    <p key={product._id}>{`${product.product.name}`} - &euro; {`${product.product.price.toFixed(2)} - quantity: ${product.quantity} - seller: ${product.seller.storeName ? product.seller.storeName : product.seller.fullName}`}</p>
                                )
                            })
                        }
                        <p><strong>Order date: </strong><span>{new Date(selectedPurchase.orderDate).toLocaleDateString()}</span></p>
                        <p><strong>Total: </strong>&euro; <span>{selectedPurchase.total.toFixed(2)}</span></p>
                        <hr/>
                        <h4><strong>Current status: </strong><span>{selectedPurchase.status}</span>{selectedPurchase.status === 'Pending' ? <button onClick={() => setRetry(true)} className='btn btn-warning'>Try to pay again</button> : null}</h4>
                        <hr/>
                        <div className='rounded px-2' style={{backgroundColor: 'rgba(255, 244, 199, 0.3)'}}>
                            <h5>Comments:</h5>
                            {
                                selectedPurchase.comments.map(comment => {
                                    return (
                                        <ul key={comment._id}>
                                            <li><strong>{comment.author.fullName}</strong> to {comment.to.storeName ? comment.to.storeName : comment.to.fullName}</li>
                                            <li>{comment.comment}</li>
                                            <li>Date: {new Date(comment.date).toLocaleDateString()} - {new Date(comment.date).toLocaleTimeString()}</li>
                                        </ul>
                                    )
                                })
                            }
                            <form onSubmit={handleAddCommentSubmit}>
                                <div className='mb-3'>
                                    <label className="form-label" htmlFor="seller">Comment the seller: </label>
                                    <select value={seller} id='seller' onChange={handleSellerChange} className="form-select" aria-label="select seller">
                                        <option disabled value=''>Select the recipient</option>
                                        {
                                            selectedPurchase.products.map(product => {
                                                return <option key={product.seller._id} value={product.seller._id}>{product.seller.storeName ? product.seller.storeName : product.seller.fullName}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="comment">Add a comment/answer</label>
                                    <textarea ref={commentRef} className="form-control" name="comment" id="comment" 
                                        placeholder="Your message to the seller... (be careful, you cannot delete the sent messages)"></textarea>
                                </div>
                                <button type="submit" className="btn btn-sm btn-outline-success border border-dark me-2">Post</button>
                            </form>
                        </div>
                    </>
                    : null
                }
                </div>
            </div>
        </div>
    ) : <div className='text-center mb-3'><h2>Loading...</h2></div>
}