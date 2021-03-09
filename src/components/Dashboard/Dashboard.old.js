import React, { useEffect, useRef, useState } from 'react';
import  {getUserProducts, getCategories, getUserCategories, getSales, getPurchases, addProduct, uploadFile, updateProduct, deleteProduct} from '../../api';
import { toast } from 'react-toastify';
import './Dashboard.css';

export default function Dashboard() {
    const [editingProduct, setEditingProduct] = useState(false);
    const [editingCategory, setEditingCategory] = useState(false);

    const [userCategories, setUserCategories] = useState([]);
    const [userSales, setUserSales] = useState([]);
    const [userPurchases, setUserPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(1);
    
    //PRODUCTS
    //name, desc, category, image_url, quantity, price
    //New product refs
    const [prodImage, setProdImage] = useState(null);
    const [categoryFromSelect, setCategory] = useState('');
    const nameRef = useRef();
    const descRef = useRef();
    const quantityRef = useRef();
    const priceRef = useRef();

    const [categories, setCategories] = useState([]);
    const [myProducts, setMyProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    //END PRODUCTS

    useEffect(() => {
        async function fetchData() {
            let response = await getUserProducts();
            setMyProducts(response.data);
            response = await getCategories();
            setCategories(response.data);
            response = await getUserCategories();
            setUserCategories(response.data);
            response = await getSales();
            setUserSales(response.data);
            response = await getPurchases();
            setUserPurchases(response.data);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleEditProductClick = (e) => {
        const {id} = e.target;
        const foundProduct = myProducts.find(item => item._id === id);

        nameRef.current.value = foundProduct.name;
        descRef.current.value = foundProduct.description;
        quantityRef.current.value = foundProduct.quantity;
        priceRef.current.value = foundProduct.price;

        setSelectedProduct(foundProduct);
        setCategory(foundProduct.category._id);
        setProdImage(null);
        setEditingProduct(true);
    }

    const handleAddProductClick = () => {
        setSelectedProduct({});
        setCategory('');

        nameRef.current.value = '';
        descRef.current.value = '';
        quantityRef.current.value = '1';
        priceRef.current.value = '';

        setProdImage(null);
        setEditingProduct(false);
    }

    const handleProductFileChange = (e) => {
        setProdImage(e.target.files[0]);
    }

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    }

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        //name, desc, category, image_url, quantity, price
        const name = nameRef.current.value;
        const description = descRef.current.value;
        const category = categoryFromSelect;
        const quantity = quantityRef.current.value;
        const price = priceRef.current.value;
        
        if(!name || !category || !quantity || !price || !prodImage) {
            toast.warning('Missing fields');
            setLoading(false);
            return;
        }

        try {
            const uploadData = new FormData();
            uploadData.append('file', prodImage);
            //returns image_url after upload
            let response = await uploadFile(uploadData);

            const newProduct = {name, description, category, quantity, price, image_url: response.data.fileUrl};

            await addProduct(newProduct);
            toast.success('Product created and available in the store');

            response = await getUserProducts();
            setMyProducts(response.data);

            e.target.reset();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleUpdateProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        //name, desc, category, image_url, quantity, price
        const name = nameRef.current.value;
        const description = descRef.current.value;
        const category = categoryFromSelect;
        const quantity = quantityRef.current.value;
        const price = priceRef.current.value;

        if(!name || !category || !quantity || !price) {
            toast.warning('Missing fields');
            setLoading(false);
            return;
        }

        try {
            let response;
            if(prodImage) {
                const uploadData = new FormData();
                uploadData.append('file', prodImage);
                //returns image_url after upload
                let response = await uploadFile(uploadData);
                const newProduct = {name, description, category, quantity, price, image_url: response.data.fileUrl};
                await updateProduct(newProduct, selectedProduct._id);
                toast.success('Product updated and available in the store');
            } else {
                const newProduct = {name, description, category, quantity, price};
                await updateProduct(newProduct, selectedProduct._id);
                toast.success('Product updated and available in the store');
            }

            response = await getUserProducts();
            setMyProducts(response.data);
            setLoading(false);
            setEditingProduct(false);
        } catch (error) {
            setLoading(false);
            setEditingProduct(false);
            console.log(error);
        }

    }

    const handleRemoveProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await deleteProduct(selectedProduct._id);
            toast.success('This product is no longer available');
            let response = await getUserProducts();
            setMyProducts(response.data);

            setSelectedProduct({});
            setEditingProduct(false);
            setLoading(false);
        } catch (error) {
            setEditingProduct(false);
            setLoading(false);
            console.log(error);
        }
    }

    return !loading ? (
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
                <div className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`} id="sales" role="tabpanel" aria-labelledby="sales-tab">Sales</div>
                
                {/* Purchases */}
                <div className={`tab-pane fade ${activeTab === 2 ? 'show active' : ''}`} id="purchases" role="tabpanel" aria-labelledby="purchases-tab">Purchases</div>
                
                {/* Products */}
                <div className={`tab-pane fade ${activeTab === 3 ? 'show active' : ''}`} id="products" role="tabpanel" aria-labelledby="products-tab">
                    <div className='row'>
                        <div className='col-md-3 my-3'>
                            <div className='mb-3'>
                                <button className="btn btn-sm btn-warning shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProducts" aria-expanded="false" aria-controls="collapseProducts">
                                    My Products
                                </button>
                                <div className="collapse mt-3 show" id="collapseProducts">
                                    <ul className="list-group">
                                        {
                                            myProducts.length
                                            ? myProducts.map(product => {
                                                return (
                                                <li key={product._id} id={product._id} role='button' onClick={handleEditProductClick} 
                                                    className={`list-group-item d-flex justify-content-between align-items-center list-custom ${product._id === selectedProduct._id ? 'active' : ''}`}>
                                                    {product.name}
                                                    <span className={`badge ${product.quantity > 0 ? product.quantity > 5 ? 'bg-primary' : 'bg-warning' : 'bg-danger'} rounded-pill`}>{product.quantity}</span>
                                                </li>
                                                )
                                            })
                                            : <li>Nothing here</li>
                                        }
                                    </ul>
                                </div>
                            </div>

                            <div className='mb-3'>
                                <button onClick={handleAddProductClick} className='btn btn-sm btn-warning shadow-none' type='button'>
                                    Sell another product
                                </button>
                            </div>
                        </div>
                        <div className="col-md-7 my-3">
                        {
                            editingProduct ? (
                                <div>
                                    <h3>Edit Product</h3>
                                    <form onSubmit={handleUpdateProductSubmit}>
                                        {/* name, desc, category, image_url, quantity, price */}
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="prod-name">Name</label>
                                            <input ref={nameRef} className="form-control" type="text" name="prod-name" id="prod-name" required />
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor="prod-pic">An attractive picture of your product</label>
                                            <input onChange={handleProductFileChange} className='form-control' type="file" name='prod-pic' id='prod-pic' />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="prod-desc">Description</label>
                                            <textarea ref={descRef} className="form-control" name="prod-desc" id="prod-desc" 
                                                placeholder="A nice description of your product"></textarea>
                                        </div>    
                                        
                                        <div className='mb-3'>
                                            <label className="form-label" htmlFor="category">Category</label>
                                            <select value={categoryFromSelect} onChange={handleCategoryChange} id='category' className="form-select" aria-label="select category">
                                                <option disabled value=''>Select a category</option>
                                                {
                                                    categories.map(category => {
                                                        return (
                                                            <option key={category._id} value={category._id}>{category.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="quantity">Quantity</label>
                                            <input ref={quantityRef} min='1' max='99' className="form-control" type="number" name="quantity" id="quantity" required />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="price">Price (&euro;)</label>
                                            <input ref={priceRef} min='1' step='0.1' className="form-control" type="number" name="price" id="price" required />
                                        </div>

                                        <button type="submit" className="btn btn-outline-success border border-dark me-2">Confirm changes</button>
                                        <button type='submit' className="btn btn-outline-danger border border-dark" form='deleteProdForm'>Remove this product</button>
                                    </form>
                                    <form id='deleteProdForm' name='deleteProdForm' onSubmit={handleRemoveProduct}></form>
                                </div>
                            ) : (
                                <div>
                                    <h3>Create Product</h3>
                                    <form onSubmit={handleAddProductSubmit}>
                                        {/* name, desc, category, image_url, quantity, price */}
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="prod-name-new">Name</label>
                                            <input ref={nameRef} className="form-control" type="text" name="prod-name" id="prod-name-new" required />
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor="prod-pic-new">An attractive picture of your product</label>
                                            <input onChange={handleProductFileChange} className='form-control' type="file" name='prod-pic' id='prod-pic-new' />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="prod-desc-new">Description</label>
                                            <textarea ref={descRef} className="form-control" name="prod-desc" id="prod-desc-new" 
                                                placeholder="A nice description of your product"></textarea>
                                        </div>    

                                        <div className='mb-3'>
                                            <label className="form-label" htmlFor="category-new">Category</label>
                                            <select value={categoryFromSelect} onChange={handleCategoryChange} className="form-select" id="category-new" aria-label="select category">
                                                <option disabled value=''>Select a category</option>
                                                {
                                                    categories.map(category => {
                                                        return (
                                                            <option key={category._id} value={category._id}>{category.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="quantity-new">Quantity</label>
                                            <input ref={quantityRef} min='1' max='99' className="form-control" type="number" name="quantity" id="quantity-new" required />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="price-new">Price (&euro;)</label>
                                            <input ref={priceRef} min='1' step='0.1' className="form-control" type="number" name="price" id="price-new" required />
                                        </div>

                                        <button type="submit" className="btn btn-outline-success border border-dark">Put product on sale</button>
                                    </form>
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className={`tab-pane fade ${activeTab === 4 ? 'show active' : ''}`} id="categories" role="tabpanel" aria-labelledby="categories-tab"></div>
            </div>
        </div>
    ) : <div className='text-center mb-3'><h2>Loading...</h2></div>
}