import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {sellProduct, removeFromCart, addOrder} from '../../api';

export default function Payment({step, setStep, user}) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(user.cart.reduce((accumulator, curr) => accumulator + curr.quantity * curr.product.price, 0).toFixed(2));
    }, [user.cart])

    const pay = async () => {
        let canFinish = true;
        
        for (const item of user.cart) {
            if(item.quantity > item.product.quantity) {
                canFinish = false;
                break;
            }
        }

        if(! canFinish) {
            toast.error('Error: you\'re trying to buy more products than are available.');
            return;
        }

        user.cart.forEach(async item => {
            let product = {product: item.product._id, quantity: 0};
            await sellProduct({quantity: item.quantity}, item.product._id);
            await removeFromCart(product);
        });

        
        //create order - {[products(product, quantity, seller)], total, client, orderDate (auto), status (Confirmed)}
        //await addOrder(order);
        const products = [];
        const status = 'Confirmed';
        user.cart.forEach(item => {
            products.push({product: item.product._id, quantity: item.quantity, seller: item.product.createdBy});
        });
        const order = {products: products, total: total, client: user._id, orderDate: Date.now, status: status};
        await addOrder(order);

        setStep(4);
    }

    return user._id && step === 3 ? (
        <div className='container-fluid text-center mt-3'>
            <h2>Payment</h2>
            <p>Total: &euro; {total}</p>
            <button onClick={pay} className='btn btn-dark'>Click to pay</button>
        </div>
    ) : null
}