import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import './CheckoutForm.css';
import { sellProduct, removeFromCart, addOrder } from '../../api'
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm({setIsPaid, user, setStatus, isPaid, total, setStep}) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [isCanceled, setIsCanceled] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    window
      .fetch(`${process.env.REACT_APP_MULTISTORE_API}/api/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({userCart: user.cart})
      })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      });
  }, [user]);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const finishCheckout = async (status) => {      
    user.cart.forEach(async item => {
        let product = {product: item.product._id, quantity: 0};
        await sellProduct({quantity: item.quantity}, item.product._id);
        await removeFromCart(product);
    });

    
    //create order - {[products(product, quantity, seller)], total, client, orderDate (auto), status (Confirmed)}
    //await addOrder(order);
    const products = [];
    user.cart.forEach(item => {
        products.push({product: item.product._id, quantity: item.quantity, seller: item.product.createdBy});
    });
    const order = {products: products, total: total, client: user._id, orderDate: Date.now, status: status};
    await addOrder(order);

    setStep(4);
}

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
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
  }

  return !(isPaid && isCanceled) ? (
    <>
    <form id="payment-form" onSubmit={handleSubmit} className='checkout-form mx-auto mt-3'>
      <h5 className='text-center mb-3'>Amount: &euro; {total}</h5>
      <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        <Redirect to='/checkout' />
      </p>
      <hr/>
      <div className='mt-3'>
        <p>Testing data:</p>
        <p>Card number: 4242 4242 4242 4242</p>
        <p>Date: any future date</p>
        <p>CVC: any value</p>
        <p>Postal code: any value</p>
      </div>

      <button onClick={paymentCanceled} className='bg-danger'>Pay later</button>
      <p>If you don't finish your payment now, you'll able to pay later through your Dashboard</p>
    </form>
    </>
  ) : <Redirect to='/checkout' />;
}
