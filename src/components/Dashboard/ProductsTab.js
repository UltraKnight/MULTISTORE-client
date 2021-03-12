import React, { useEffect, useState } from 'react';
import  {getUserProducts, getCategories, addProduct, uploadFile, updateProduct, deleteProduct} from '../../api';
import { toast } from 'react-toastify';

export default function ProductsTab({activeTab}) {
    const [loading, setLoading] = useState(true);
    //PRODUCTS
    //name, desc, category, image_url, quantity, price
    //New product refs
    const [editingProduct, setEditingProduct] = useState(false);
    const [prodImage, setProdImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [myProducts, setMyProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [newProduct, setNewProduct] = useState({});
    //END PRODUCTS

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            let response = await getUserProducts();
            setMyProducts(response.data);
            response = await getCategories();
            setCategories(response.data);
            setLoading(false);
        }
        if(isMounted) {
            fetchData();
        }
        return () => { isMounted = false }
    }, []);

    const handleEditProductClick = (e) => {
        const {id} = e.target;
        const foundProduct = myProducts.find(item => item._id === id);
    
        setSelectedProduct(foundProduct);
        setNewProduct(foundProduct);
        setProdImage(null);
        setEditingProduct(true);
    }

    const handleAddProductClick = () => {
        setSelectedProduct({});
        setNewProduct({});

        setProdImage(null);
        setEditingProduct(false);
    }

    const handleProductFileChange = (e) => {
        setProdImage(e.target.files[0]);
    }

    const handleGeneralChange = (e) => {
        const {name, value} = e.target;
        //get all the product and change only the value of the changed field
        setNewProduct({...newProduct, [name]: value});
    }

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        //name, desc, category, image_url, quantity, price
        const name = newProduct.name;
        const description = newProduct.description;
        const category = newProduct.category;
        const quantity = newProduct.quantity;
        const price = newProduct.price;
        
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

            const addProductResponse = await addProduct(newProduct);
            toast.success('Product created and available in the store');

            // response = await getUserProducts();
            // setMyProducts(response.data);
            setMyProducts(...myProducts, addProductResponse.data);

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
        const name = newProduct.name;
        const description = newProduct.description;
        const category = newProduct.category;
        const quantity = newProduct.quantity;
        const price = newProduct.price;

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
            setNewProduct({});
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
                                            className={`list-group-item d-flex justify-content-between align-items-center list-custom ${selectedProduct && (product._id === selectedProduct._id ? 'active' : '')}`}>
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
                                    <input onChange={handleGeneralChange} value={newProduct.name || ''} className="form-control" type="text" name="name" id="prod-name" required />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="prod-pic">An attractive picture of your product</label>
                                    <input onChange={handleProductFileChange} className='form-control' type="file" name='prod-pic' id='prod-pic' />
                                </div>

                                <div className='mb-3'>
                                    <p className='m-0 me-3'>Current image</p>
                                    <img height='100px' width='auto' src={selectedProduct.image_url} alt={selectedProduct.name}/>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="prod-desc">Description</label>
                                    <textarea rows='10' value={newProduct.description || ''} onChange={handleGeneralChange} className="form-control" name="description" id="prod-desc" 
                                        placeholder="A nice description of your product"></textarea>
                                </div>    
                                
                                <div className='mb-3'>
                                    <label className="form-label" htmlFor="category">Category</label>
                                    <select value={newProduct.category || ''} onChange={handleGeneralChange} name='category' id='category' className="form-select" aria-label="select category">
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
                                    <input onChange={handleGeneralChange} value={newProduct.quantity || ''} min='1' max='99' className="form-control" type="number" name="quantity" id="quantity" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="price">Price (&euro;)</label>
                                    <input onChange={handleGeneralChange} value={newProduct.price || ''} min='1' step='0.01' className="form-control" type="number" name="price" id="price" required />
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
                                    <input onChange={handleGeneralChange} value={newProduct.name || ''} className="form-control" type="text" name="name" id="prod-name-new" required />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="prod-pic-new">An attractive picture of your product</label>
                                    <input onChange={handleProductFileChange} className='form-control' type="file" name='prod-pic' id='prod-pic-new' />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="prod-desc-new">Description</label>
                                    <textarea value={newProduct.description || ''} onChange={handleGeneralChange} className="form-control" name="description" id="prod-desc-new" 
                                        placeholder="A nice description of your product"></textarea>
                                </div>    

                                <div className='mb-3'>
                                    <label className="form-label" htmlFor="category-new">Category</label>
                                    <select onChange={handleGeneralChange} value={newProduct.category || ''} name='category' className="form-select" id="category-new" aria-label="select category">
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
                                    <input onChange={handleGeneralChange} value={newProduct.quantity || ''} min='1' max='99' className="form-control" type="number" name="quantity" id="quantity-new" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="price-new">Price (&euro;)</label>
                                    <input onChange={handleGeneralChange} value={newProduct.price || ''} min='1' step='0.01' className="form-control" type="number" name="price" id="price-new" required />
                                </div>

                                <button type="submit" className="btn btn-outline-success border border-dark">Put product on sale</button>
                            </form>
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    ) : <div className='text-center mb-3'><h2>Loading...</h2></div>
}