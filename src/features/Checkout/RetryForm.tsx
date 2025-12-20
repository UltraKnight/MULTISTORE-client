import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Order } from 'src/types/order';
import { getPurchases, updateStatus } from '../../api';
import './CheckoutForm.css';

type RetryProps = {
  total: number;
  orderId: string;
  retry: boolean;
  setRetry: (retry: boolean) => void;
  setPurchases: (purchases: Order[]) => void;
  setSelectedPurchase: (purchase: Order | null) => void;
};

export default function RetryForm({ total, orderId, retry, setRetry, setPurchases, setSelectedPurchase }: RetryProps) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [isCanceled, setIsCanceled] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    let isMounted = true;
    if (isMounted) {
      window
        .fetch(`${import.meta.env.REACT_APP_MULTISTORE_API}/api/retry-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ total: total }),
        })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [total]);

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const handleChange = async (event: StripeCardElementChangeEvent) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);

    const cardElement = elements?.getElement(CardElement);

    if (!stripe || !cardElement) {
      toast.error("We couldn't process your request, please try again.");
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
      updateStatus(orderId, { status: 'Pending' });
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      await updateStatus(orderId, { status: 'Confirmed' });

      const response = await getPurchases();
      setPurchases(response.data);
      const foundPurchase = response.data.find((item) => item._id === orderId);

      if (!foundPurchase) {
        toast.error('Unable to find purchase');
        return;
      }
      setSelectedPurchase(foundPurchase);

      setRetry(false);
      setIsCanceled(true);
      toast.success('Payment approved!');
    }
  };

  const paymentCanceled = () => {
    setIsCanceled(true);
    setRetry(false);
    toast.error('Payment canceled by the user');
  };

  return !isCanceled && retry ? (
    <>
      <form id='payment-form' onSubmit={handleSubmit} className='checkout-form mx-auto mt-3'>
        <h5 className='text-center mb-3'>Amount: &euro; {total}</h5>
        <CardElement id='card-element' options={cardStyle} onChange={handleChange} />
        <button disabled={processing || disabled || succeeded} id='submit'>
          <span id='button-text'>{processing ? <div className='spinner' id='spinner'></div> : 'Pay now'}</span>
        </button>
        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className='card-error' role='alert'>
            {error}
          </div>
        )}
        {/* Show a success message upon completion */}
        <p className={succeeded ? 'result-message' : 'result-message hidden'}>
          <Navigate to='/dashboard' />
        </p>
        <hr />
        <div className='mt-3'>
          <p>Testing data:</p>
          <p>Card number: 4242 4242 4242 4242</p>
          <p>Date: any future date</p>
          <p>CVC: any value</p>
          <p>Postal code: any value</p>
        </div>

        <button onClick={paymentCanceled} className='bg-danger'>
          Pay later
        </button>
        <p>If you don't finish your payment now, you'll able to pay later through your Dashboard</p>
      </form>
    </>
  ) : (
    <Navigate to='/dashboard' />
  );
}
