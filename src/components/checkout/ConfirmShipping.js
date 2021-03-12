import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ConfirmShipping({step, setStep, user}) {
    const [canContinue, setCanContinue] = useState(false);

    useEffect(() => {
        let isAddressesOk = true;
        if(! (user.shipping.firstName && user.shipping.lastName && user.shipping.address1 &&
        user.shipping.city && user.shipping.state && user.shipping.postcode && user.shipping.country)) {
            isAddressesOk = false;
        }

        if(! (user.billing.firstName && user.billing.lastName && user.billing.address1 &&
            user.billing.city && user.billing.state && user.billing.postcode && user.billing.country)) {
            isAddressesOk = false;
        }

        setCanContinue(isAddressesOk);
    }, [user]);

    return user._id && step === 2 ? (
        <>
        <div className='text-center'>
            <h2>Review addresses</h2>
        </div>
        <div className='row mt-3 mx-3'>
                <div className='col-md-6 col-lg-4 offset-lg-3'>
                    <h3>Shipping</h3>
                    <p><strong>Name: </strong>{user.shipping.firstName} {user.shipping.lastName}</p>
                    <p><strong>Address: </strong>{user.shipping.address1} - {user.shipping.address2}</p>
                    <p><strong>City: </strong>{user.shipping.city}</p>
                    <p><strong>State: </strong>{user.shipping.state}</p>
                    <p><strong>Postal Code: </strong>{user.shipping.postcode}</p>
                    <p><strong>Country: </strong>{user.shipping.country}</p>
                </div>

                <div className='col-md-6 col-lg-4'>
                    <h3>Billing</h3>
                    <p><strong>Name: </strong>{user.shipping.firstName} {user.shipping.lastName}</p>
                    <p><strong>Address: </strong>{user.shipping.address1} - {user.shipping.address2}</p>
                    <p><strong>City: </strong>{user.shipping.city}</p>
                    <p><strong>State: </strong>{user.shipping.state}</p>
                    <p><strong>Postal Code: </strong>{user.shipping.postcode}</p>
                    <p><strong>Country: </strong>{user.shipping.country}</p>
                </div>
        </div>
        <div className='row mb-3'>
            <div className='col-md-6 offset-md-3 col-lg-4 offset-lg-4'>
                {
                    canContinue
                    ? <button onClick={() => setStep(3)} className='ms-4 btn btn-success'>Proceed</button>
                    : <p>You cannot continue without filling your profile's shipping and billing information.</p>
                }
                <button onClick={() => setStep(1)} className='ms-4 btn btn-danger'>Back</button>
                <Link  style={{textDecoration: 'none'}} className='ms-4 btn btn-warning' to='/profile'>Go to profile</Link>
            </div>
        </div>
        </>
    ) : null
}