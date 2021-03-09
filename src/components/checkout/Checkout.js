import React, {useState, useEffect} from 'react';
import {loggedin} from '../../api';
import ConfirmShipping from './ConfirmShipping';
import Payment from './Payment';
import Finish from './Finish';
import Review from './Review';

export default function Checkout() {
    const [user, setUser] = useState({});
    const [checkoutStep, setCheckoutStep] = useState(1);

    useEffect(() => {
        async function fetchData() {
            const response = await loggedin();
            if(response.data._id) {
                setUser(response.data);
                setCheckoutStep(1);
            }
        }

        fetchData();
    }, []);

    return user._id ? (
        <>
        <Review step={checkoutStep} setStep={setCheckoutStep} user={user} />
        <ConfirmShipping step={checkoutStep} setStep={setCheckoutStep} user={user} />
        <Payment step={checkoutStep} setStep={setCheckoutStep} user={user} />
        <Finish step={checkoutStep} user={user} />
        </>
    ) : null
}