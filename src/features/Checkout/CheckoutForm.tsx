import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { OrderStatus } from 'src/types/order';
import type { CartItem } from 'src/types/product';
import type { User } from 'src/types/user';
import { addOrder, removeFromCart, sellProduct } from '../../api';
import './CheckoutForm.css';

type CheckoutFormProps = {
  setIsPaid: (isPaid: boolean) => void;
  user: User;
  isPaid: boolean;
  setStatus: (status: OrderStatus) => void;
  total: number;
  setStep: (step: number) => void;
  setBasketQuantity: React.Dispatch<React.SetStateAction<number>>;
};

export default function CheckoutForm({
  setIsPaid,
  user,
  setStatus,
  isPaid,
  total,
  setStep,
  setBasketQuantity,
}: CheckoutFormProps) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [isCanceled, setIsCanceled] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    window
      .fetch(`${import.meta.env.REACT_APP_MULTISTORE_API}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userCart: user.cart }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [user]);

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

  const finishCheckout = async (status: 'Pending' | 'Confirmed') => {
    for (const item of user.cart ?? []) {
      await sellProduct({ quantity: item.quantity }, item.product._id!);
      await removeFromCart({ product: item.product._id!, quantity: 0 });
    }

    //create order - {[products(product, quantity, seller)], total, client, orderDate (auto), status (Confirmed)}
    const products: CartItem[] = [];
    user.cart?.forEach((item) => {
      if (typeof item?.product.createdBy !== 'string') {
        toast.error('Product createdBy must be a string. Pleas contact support or try to order again.');
        throw new Error('Product createdBy must be a string.');
      }
      products.push({ product: item.product._id!, quantity: item.quantity, seller: item.product.createdBy });
    });
    const order = { products: products, total: total, client: user._id, orderDate: Date.now(), status: status };
    await addOrder(order);

    if (status === 'Confirmed') {
      setBasketQuantity(0);
    }

    setStep(4);
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
      toast.error("We couldn't process the payment, please try again.");
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
      setIsPaid(true);
      setStatus('Pending');
      finishCheckout('Pending');
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      setIsPaid(true);
      setStatus('Confirmed');
      finishCheckout('Confirmed');
    }
  };

  const paymentCanceled = () => {
    setIsPaid(true);
    setStatus('Pending');
    setIsCanceled(true);
    finishCheckout('Pending');
  };

  return !(isPaid && isCanceled) ? (
    <>
      <form id='payment-form' onSubmit={handleSubmit} className='checkout-form mx-auto mt-3'>
        <h5 className='text-center mb-3'>Amount: &euro; {total}</h5>
        <CardElement id='card-element' options={cardStyle} onChange={handleChange} />
        <button disabled={!!(processing || disabled || succeeded)} id='submit'>
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
          <Navigate to='/checkout' />
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
    <Navigate to='/checkout' />
  );
}
