import React, { useEffect, useRef, useState } from 'react';
import  {getUserCategories, addCategory, updateCategory, getUserProducts, deleteCategory} from '../../api';
import { toast } from 'react-toastify';

export default function CategoriesTab({activeTab}) {
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(false);
    const nameRef = useRef();

    const [myCategories, setMyCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({});

    useEffect(() => {
        async function fetchData() {
            let response = await getUserCategories();
            setMyCategories(response.data);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleEditCategoryClick = (e) => {
        const {id} = e.target;
        const foundCategory = myCategories.find(item => item._id === id);

        nameRef.current.value = foundCategory.name;

        setSelectedCategory(foundCategory);
        setEditingCategory(true);
    }

    const handleAddCategoryClick = () => {
        setSelectedCategory({});

        nameRef.current.value = '';

        setEditingCategory(false);
    }

    const handleAddCategorySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const name = nameRef.current.value;
        
        if(!name) {
            toast.warning('Give a name to your category');
            setLoading(false);
            return;
        }

        try {
            const newCategory = {name};

            await addCategory(newCategory);
            toast.success('Category created');

            let response = await getUserCategories();
            setMyCategories(response.data);

            e.target.reset();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleUpdateCategorySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        //name, desc, category, image_url, quantity, price
        const name = nameRef.current.value;

        if(!name) {
            toast.warning('Give a name to your category');
            setLoading(false);
            return;
        }

        try {
            const newCategory = {name};
            await updateCategory(newCategory, selectedCategory._id);
            toast.success('Category updated');

            let response = await getUserCategories();
            setMyCategories(response.data);
            setLoading(false);
            setEditingCategory(false);
        } catch (error) {
            setLoading(false);
            setEditingCategory(false);
            console.log(error);
        }
    }

    const handleRemoveCategory = async (e) => {
        e.preventDefault();
        setLoading(true);

        let response = await getUserProducts();
        response = response.data;
        const foundProduct = response.find(product => product.category._id === selectedCategory._id);
        if(foundProduct) {
            toast.warning('Unable to delete. You have products using this category');
            setEditingCategory(false);
            setLoading(false);
            return;
        }

        try {
            await deleteCategory(selectedCategory._id);
            toast.success('This category is no longer available');
            response = await getUserCategories();
            setMyCategories(response.data);

            setSelectedCategory({});
            setEditingCategory(false);
            setLoading(false);
        } catch (error) {
            setEditingCategory(false);
            setLoading(false);
            console.log(error);
        }
    }

    return !loading ? (
        <div className={`tab-pane fade ${activeTab === 4 ? 'show active' : ''}`} id="categories" role="tabpanel" aria-labelledby="categories-tab">
            <div className='row'>
                <div className='col-md-3 my-3'>
                    <div className='mb-3'>
                        <button className="btn btn-sm btn-warning shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCategories" aria-expanded="false" aria-controls="collapseCategories">
                            My Categories
                        </button>
                        <div className="collapse mt-3 show" id="collapseCategories">
                            <ul className="list-group">
                                {
                                    myCategories.length
                                    ? myCategories.map(category => {
                                        return (
                                        <li key={category._id} id={category._id} role='button' onClick={handleEditCategoryClick} 
                                            className={`list-group-item d-flex justify-content-between align-items-center list-custom ${selectedCategory && (category._id === selectedCategory._id ? 'active' : '')}`}>
                                            {category.name}
                                        </li>
                                        )
                                    })
                                    : <li>Nothing here</li>
                                }
                            </ul>
                        </div>
                    </div>

                    <div className='mb-3'>
                        <button onClick={handleAddCategoryClick} className='btn btn-sm btn-warning shadow-none' type='button'>
                            Create new category
                        </button>
                    </div>
                </div>
                <div className="col-md-7 my-3">
                {
                    editingCategory ? (
                        <div>
                            <h3>Edit Category</h3>
                            <form onSubmit={handleUpdateCategorySubmit}>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="cat-name">Name</label>
                                    <input ref={nameRef} className="form-control" type="text" name="cat-name" id="cat-name" required />
                                </div>

                                <button type="submit" className="btn btn-outline-success border border-dark me-2">Confirm changes</button>
                                <button type='submit' className="btn btn-outline-danger border border-dark" form='deleteCategoryForm'>Remove this category</button>
                            </form>
                            <form id='deleteCategoryForm' name='deleteCategoryForm' onSubmit={handleRemoveCategory}></form>
                        </div>
                    ) : (
                        <div>
                            <h3>Create Category</h3>
                            <form onSubmit={handleAddCategorySubmit}>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="cat-name">Name</label>
                                    <input ref={nameRef} className="form-control" type="text" name="cat-name" id="cat-name" required />
                                </div>

                                <button type="submit" className="btn btn-outline-success border border-dark">Create</button>
                            </form>
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    ) : <div className='text-center mb-3'><h2>Loading...</h2></div>
}