import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { User } from 'src/types/user';
import CheckoutForm from './CheckoutForm';

const promise = loadStripe(import.meta.env.REACT_APP_STRIPE_PK);

type PaymentProps = {
  step: number;
  setStep: (step: number) => void;
  user: User;
  setStatus: (status: string) => void;
};

export default function Payment({ step, setStep, user, setStatus }: PaymentProps) {
  const [total, setTotal] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [canFinish, setCanFinish] = useState(true);

  useEffect(() => {
    //calculate order final price in the server
    async function fetchData() {
      setTotal(+user.cart!.reduce((accumulator, curr) => accumulator + curr.quantity * curr.product.price!, 0).toFixed(2));
      setIsPaid(false);
      setCanFinish(true);

      for (const item of user.cart ?? []) {
        if (item.quantity > (item.product.quantity ?? 0)) {
          setCanFinish(false);
          toast.error("Error: you're trying to buy more products than are available.");
          break;
        }
      }
    }

    fetchData();
  }, [user.cart]);

  return user._id && step === 3 ? (
    isPaid ? null : // <div className='container-fluid text-center mt-3'>
    //     <h2>Payment</h2>
    //     <p>Total: &euro; {total}</p>
    //     <button onClick={pay} className='btn btn-dark'>Click to pay</button>
    // </div>
    canFinish ? (
      <div>
        <Elements stripe={promise}>
          <CheckoutForm
            setIsPaid={setIsPaid}
            user={user}
            setStatus={setStatus}
            isPaid={isPaid}
            total={total}
            setStep={setStep}
          />
        </Elements>
      </div>
    ) : (
      <Navigate to='/' />
    )
  ) : null;
}
