import React, {useState, useEffect} from 'react';
import {loggedin} from '../../api';
import { Redirect } from 'react-router-dom';
import ConfirmShipping from './ConfirmShipping';
import Payment from './Payment';
import Finish from './Finish';
import Review from './Review';

export default function Checkout() {
    const [user, setUser] = useState({});
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [status, setStatus] = useState('Pending');

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            const response = await loggedin();
            if(response.data._id) {
                if(isMounted) {
                    setUser(response.data);
                    setCheckoutStep(1);
                    setStatus('Pending');
                }
            }
        }
        fetchData();
        return () => { isMounted = false };
    }, []);

    return user._id ? (
        user.cart.length && user.emailConfirmed ?
        <>
        <Review step={checkoutStep} setStep={setCheckoutStep} user={user} />
        <ConfirmShipping step={checkoutStep} setStep={setCheckoutStep} user={user} />
        <Payment step={checkoutStep} setStep={setCheckoutStep} user={user} setStatus={setStatus} status={status} />
        <Finish step={checkoutStep} user={user} status={status} setStep={setCheckoutStep} />
        </>
        : <Redirect to='/products' />
    ) : null
}