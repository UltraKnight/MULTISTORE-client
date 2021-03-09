import React from 'react';
import { Link } from 'react-router-dom';

export default function Finish({step, user}) {
    return user._id && step === 4 ? (
        <div className='text-center mt-3'>
            <h2>Thank you for your purchase!</h2>
            <Link to='/dashboard' className='btn btn-primary'>Go to my dashboard</Link>
        </div>
    ) : null
}