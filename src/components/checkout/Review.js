import React from 'react';

export default function Review({step, setStep, user}) {

    return step === 1 && user._id ? (
        <div className='row mt-3 mx-3'>
            <div className="col-md-8 offset-md-2">
                <div className='text-center'>
                    <h2>Review products</h2>
                </div>
                {
                    user.cart.map((item, index) => {
                        return (
                            <>
                            <div key={item._id} className='d-flex align-items-center flex-wrap'>
                                <div className='me-5'>
                                    <ul style={{listStyleType: 'none', fontSize: '1.2rem'}}>
                                        <li>{item.product.name}</li>
                                        <li>Quantity: {item.quantity}</li>
                                        <li>Unit price: &euro; {item.product.price.toFixed(2)}</li>
                                        <li>Subtotal: &euro; {(item.product.price * item.quantity).toFixed(2)}</li>
                                    </ul>
                                </div>
                                <div>
                                    <img width='200px' src={item.product.image_url} alt={item.product.name} />
                                </div>
                            </div>
                            <hr key={index} />
                            </>
                        )
                    })
                }
                <div>
                    <ul style={{listStyleType: 'none', fontSize: '1.2rem'}}>
                        <li>Total: &euro; {user.cart.reduce((accumulator, curr) => accumulator + curr.quantity * curr.product.price, 0).toFixed(2)}</li>
                    </ul>
                    <button onClick={() => setStep(2)} className='ms-4 btn btn-success'>Proceed</button>
                </div>
            </div>
        </div>
    ) : null
}