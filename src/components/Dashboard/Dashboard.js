import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loggedin } from '../../api';
import './Dashboard.css';

//tabs
import SalesTab from './SalesTab';
import ProductsTab from './ProductsTab';
import CategoriesTab from './CategoriesTab';
import PurchasesTab from './PurchasesTab';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState(1);
    const [currUser, setCurrUser] = useState({});
    
    useEffect(() => {
        async function fetchData() {
            const response = await loggedin();
            if(response.data._id) {
                setCurrUser(response.data);
            }
        }
        fetchData();
    }, [])

    return currUser._id && currUser.emailConfirmed ? (
        <div className='container-fluid'>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button onClick={() => setActiveTab(1)} className={`nav-link ${activeTab === 1 ? 'active' : ''}`} id="sales-tab" data-bs-toggle="tab" data-bs-target="#sales" type="button" role="tab" aria-controls="sales" aria-selected="true">Sales</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button onClick={() => setActiveTab(2)} className={`nav-link ${activeTab === 2 ? 'active' : ''}`} id="purchases-tab" data-bs-toggle="tab" data-bs-target="#purchases" type="button" role="tab" aria-controls="purchases" aria-selected="false">Purchases</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button onClick={() => setActiveTab(3)} className={`nav-link ${activeTab === 3 ? 'active' : ''}`} id="products-tab" data-bs-toggle="tab" data-bs-target="#products" type="button" role="tab" aria-controls="products" aria-selected="false">Products</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button onClick={() => setActiveTab(4)} className={`nav-link ${activeTab === 4 ? 'active' : ''}`} id="categories-tab" data-bs-toggle="tab" data-bs-target="#categories" type="button" role="tab" aria-controls="categories" aria-selected="false">My categories</button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                {/* Sales */}
                {activeTab && activeTab === 1? <SalesTab activeTab={activeTab} /> : null}
                
                {/* Purchases */}
                {activeTab && activeTab === 2 ? <PurchasesTab activeTab={activeTab} /> : null}
                
                {/* Products */}
                {activeTab && activeTab === 3 ? <ProductsTab activeTab={activeTab} /> : null}

                {/* Categories */}
                {activeTab && activeTab === 4 ? <CategoriesTab activeTab={activeTab} /> : null}
                {/* <div className={`tab-pane fade ${activeTab === 4 ? 'show active' : ''}`} id="categories" role="tabpanel" aria-labelledby="categories-tab"></div> */}
            </div>
        </div>
    ) : currUser._id ? <p className='m-3'>Please, <Link to='/profile'>confirm your email</Link> before using the dashboard.</p> : null
}