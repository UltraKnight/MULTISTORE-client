import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import type { Order, OrderStatus } from 'src/types/order';
import { addComment, getPurchases } from '../../api';
import RetryForm from '../Checkout/RetryForm';

const promise = loadStripe(import.meta.env.REACT_APP_STRIPE_PK);

export default function SalesTab({ activeTab }: { activeTab: number }) {
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(false);
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<Order | null>(null);
  const [seller, setSeller] = useState('');
  const commentRef = useRef<HTMLTextAreaElement | null>(null);
  const canAddComment: OrderStatus[] = ['Confirmed', 'In transit', 'Processing'];

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const response = await getPurchases();
      setPurchases(response.data);
      setSeller('');
      setLoading(false);
      setRetry(false);
    }
    if (isMounted) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePurchaseClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const { id } = e.currentTarget;
    const foundPurchase = purchases.find((item) => item._id === id) ?? null;
    setSelectedPurchase(foundPurchase);
  };

  const handleAddCommentSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const comment = commentRef.current?.value;

    if (!comment) {
      toast.warning('Add a comment...');
      setLoading(false);
      return;
    }

    if (!seller) {
      toast.warning('Select the recipient');
      setLoading(false);
      return;
    }

    if (!selectedPurchase?._id) {
      toast.warning('Select the purchase');
      setLoading(false);
      return;
    }

    try {
      await addComment(selectedPurchase._id, seller, comment);
      toast.success('Comment published');

      const response = await getPurchases();
      setPurchases(response.data);

      const updatedPurchase = response.data.find((item) => item._id === selectedPurchase._id) ?? null;
      setSelectedPurchase(updatedPurchase);
      setSeller('');

      e.currentTarget.reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSellerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeller(e.target.value);
  };

  return !loading ? (
    retry && selectedPurchase?._id && selectedPurchase?.total ? (
      <div>
        <Elements stripe={promise}>
          <RetryForm
            total={selectedPurchase?.total}
            orderId={selectedPurchase?._id}
            retry={retry}
            setRetry={setRetry}
            setPurchases={setPurchases}
            setSelectedPurchase={setSelectedPurchase}
          />
        </Elements>
      </div>
    ) : (
      <div
        className={`tab-pane fade ${activeTab === 2 ? 'show active' : ''}`}
        id='purchases'
        role='tabpanel'
        aria-labelledby='purchases-tab'
      >
        <div className='row'>
          <div className='col-md-3 my-3'>
            <div className='mb-3'>
              <button
                className='btn btn-sm btn-warning shadow-none'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#collapsePurchases'
                aria-expanded='false'
                aria-controls='collapsePurchases'
              >
                My Purchases
              </button>
              <div className='collapse mt-3 show' id='collapsePurchases'>
                <ul className='list-group'>
                  {purchases.length ? (
                    purchases.map((purchase) => {
                      return (
                        <li
                          key={purchase._id}
                          id={purchase._id}
                          role='button'
                          onClick={handlePurchaseClick}
                          className={`list-group-item d-flex justify-content-between align-items-center list-custom ${
                            selectedPurchase && (purchase._id === selectedPurchase._id ? 'active' : '')
                          }`}
                        >
                          {`id: ${purchase._id} - ${purchase.products?.length} product(s) - ${
                            purchase.orderDate && new Date(purchase.orderDate).toLocaleDateString()
                          }`}
                        </li>
                      );
                    })
                  ) : (
                    <li>Nothing here</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-md-7 my-3'>
            {selectedPurchase && selectedPurchase._id ? (
              <>
                <h3>Purchase details</h3>
                <h5>Products</h5>
                {selectedPurchase.products?.map((product) => {
                  if (typeof product.product !== 'string')
                    return (
                      <div key={product?.product._id}>
                        <p key={product?.product._id}>
                          {`${product.product?.name}`} - &euro;{' '}
                          {`${product.product.price?.toFixed(2)} - quantity: ${product.quantity} - seller: ${
                            typeof product.seller !== 'string'
                              ? product.seller.storeName
                                ? product.seller.storeName
                                : product.seller.fullName
                              : 'Unknown seller'
                          }`}
                        </p>
                        <img height='100px' width='auto' src={product.product.image_url} alt={product.product.name} />
                      </div>
                    );
                })}
                <p>
                  <strong>Order date: </strong>
                  <span>{selectedPurchase.orderDate && new Date(selectedPurchase.orderDate).toLocaleDateString()}</span>
                </p>
                <p>
                  <strong>Total: </strong>&euro; <span>{selectedPurchase.total?.toFixed(2)}</span>
                </p>
                <hr />
                <h4>
                  <strong>Current status: </strong>
                  <span>{selectedPurchase.status}</span>
                  {selectedPurchase.status === 'Pending' ? (
                    <button onClick={() => setRetry(true)} className='btn btn-warning'>
                      Try to pay again
                    </button>
                  ) : null}
                </h4>
                <hr />
                <div className='rounded px-2' style={{ backgroundColor: 'rgba(255, 244, 199, 0.3)' }}>
                  <h5>Comments:</h5>
                  {selectedPurchase.comments?.map((comment) => {
                    if (typeof comment.author !== 'string' && typeof comment.to !== 'string')
                      return (
                        <ul key={comment._id}>
                          <li>
                            <strong>{comment.author.fullName}</strong> to{' '}
                            {comment.to.storeName ? comment.to.storeName : comment.to.fullName}
                          </li>
                          <li>{comment.comment}</li>
                          <li>
                            Date: {new Date(comment.date).toLocaleDateString()} -{' '}
                            {new Date(comment.date).toLocaleTimeString()}
                          </li>
                        </ul>
                      );
                  })}
                  {canAddComment.some((item) => item === selectedPurchase.status) ? (
                    <form onSubmit={handleAddCommentSubmit}>
                      <div className='mb-3'>
                        <label className='form-label' htmlFor='seller'>
                          Comment to the seller:{' '}
                        </label>
                        <select
                          value={seller}
                          id='seller'
                          onChange={handleSellerChange}
                          className='form-select'
                          aria-label='select seller'
                        >
                          <option disabled value=''>
                            Select the recipient
                          </option>
                          {selectedPurchase.products?.map((product) => {
                            if (typeof product.seller !== 'string')
                              return (
                                <option key={product.seller._id} value={product.seller._id}>
                                  {product.seller.storeName ? product.seller.storeName : product.seller.fullName}
                                </option>
                              );
                          })}
                        </select>
                      </div>
                      <div className='mb-3'>
                        <label className='form-label' htmlFor='comment'>
                          Add a comment/answer
                        </label>
                        <textarea
                          ref={commentRef}
                          className='form-control'
                          name='comment'
                          id='comment'
                          placeholder='Your message to the seller... (be careful, you cannot delete the sent messages)'
                        ></textarea>
                      </div>
                      <button type='submit' className='btn btn-sm btn-outline-success border border-dark me-2'>
                        Post
                      </button>
                    </form>
                  ) : (
                    <span>You can't add comments to finished purchases.</span>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    )
  ) : (
    <div className='text-center mb-3'>
      <h2>Loading...</h2>
    </div>
  );
}
