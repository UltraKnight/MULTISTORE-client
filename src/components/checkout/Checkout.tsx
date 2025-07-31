import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from 'src/types/user';
import { loggedin } from '../../api';
import ConfirmShipping from './ConfirmShipping';
import Finish from './Finish';
import Payment from './Payment';
import Review from './Review';

export default function Checkout() {
  const [user, setUser] = useState<User | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    async function fetchData() {
      const response = await loggedin();
      if (response.data._id) {
        setUser(response.data);
        setCheckoutStep(1);
        setStatus('Pending');
      }
    }

    fetchData();
  }, []);

  return user?._id ? (
    user.cart?.length && user.emailConfirmed ? (
      <>
        {checkoutStep === 1 ? <Review step={checkoutStep} setStep={setCheckoutStep} user={user} /> : null}
        {checkoutStep === 2 ? <ConfirmShipping step={checkoutStep} setStep={setCheckoutStep} user={user} /> : null}
        {checkoutStep === 3 ? (
          <Payment step={checkoutStep} setStep={setCheckoutStep} user={user} setStatus={setStatus} />
        ) : null}
        {checkoutStep === 4 ? (
          <Finish step={checkoutStep} user={user} status={status} />
        ) : null}
      </>
    ) : (
      <Navigate to='/products' />
    )
  ) : null;
}
