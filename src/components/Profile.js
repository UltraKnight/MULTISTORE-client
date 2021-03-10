import React, { useState, useEffect, useRef } from 'react';
import {loggedin, updateProfile, updateEmail, getLatLng, getAddress} from '../api';
import {FiEdit, FiSave, FiX} from 'react-icons/fi';
import './Profile.css';
import { toast } from 'react-toastify';

export default function Profile() {
    const [user, setUser] = useState({});
    const [editableBasic, setEditableBasic] = useState(false);
    const [editableContact, setEditableContact] = useState(false);
    const [editableBilling, setEditableBilling] = useState(false);
    const [editableShipping, setEditableShipping] = useState(false);
    const fullNameRef = useRef();
    const storeNameRef = useRef();
    const usernameRef = useRef();
    const emailRef = useRef();
    const bilFirstNameRef = useRef();
    const bilLastNameRef = useRef();
    const bilAddress1Ref = useRef();
    const bilAddress2Ref = useRef();
    const bilCityRef = useRef();
    const bilStateRef = useRef();
    const bilCountryRef = useRef();
    const bilPostcodeRef = useRef();
    const bilPhoneRef = useRef();
    const shipFirstNameRef = useRef();
    const shipLastNameRef = useRef();
    const shipAddress1Ref = useRef();
    const shipAddress2Ref = useRef();
    const shipCityRef = useRef();
    const shipStateRef = useRef();
    const shipCountryRef = useRef();
    const shipPostcodeRef = useRef();
    const shipPhoneRef = useRef();
    const isShipEqualsRef = useRef();

    const postcodeRef = useRef();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await loggedin();
                setUser(response.data);

                if(usernameRef.current) {
                    usernameRef.current.innerHTML = response.data.username;
                }

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [editableBasic, editableContact, editableBilling, editableShipping]);

    const handleBasicKeyPress = (e) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            handleBasicClick();
        }
    }

    const handleBillingKeyPress = (e) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            handleBillingClick();
        }
    }

    const handleShippingKeyPress = (e) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            handleShippingClick();
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value.trim();
        if(!email) {
            toast.warning('Email cannnot be empty');
            return;
        }

        try {
            const response = await updateEmail({email: email});
            setEditableContact(false);
            toast.success(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleBasicClick = async () => {
        if(editableBasic) {
            const fullName = fullNameRef.current.innerHTML.trim();
            const storeName = storeNameRef.current.innerHTML.trim();
            const username = usernameRef.current.innerHTML.trim();
            
            if(!fullName || !username) {
                toast.warning('Missing fields');
                return;
            }

            try {
                let response = await updateProfile({fullName, storeName, username});
                setEditableBasic(false);
                toast.success(response.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            setEditableBasic(true);
        }
    }

    const handleContactClick = async () => {
        if(! editableContact) {
            setEditableContact(true);
            emailRef.current.value = user.email;
        }
    }

    const handleBillingClick = async () => {
        if(editableBilling) {
            const firstName = bilFirstNameRef.current.innerHTML.trim();
            const lastName = bilLastNameRef.current.innerHTML.trim();
            const address1 = bilAddress1Ref.current.innerHTML.trim();
            const address2 = bilAddress2Ref.current.innerHTML.trim();
            const city = bilCityRef.current.innerHTML.trim();
            const state = bilStateRef.current.innerHTML.trim();
            const country = bilCountryRef.current.innerHTML.trim();
            const postcode = bilPostcodeRef.current.innerHTML.trim();
            const phone = bilPhoneRef.current.innerHTML.trim();
            const copyToShip = isShipEqualsRef.current.checked;

            if(!firstName || !lastName || !address1 || !city || !state || !country || !postcode || !phone) {
                toast.warning('Missing fields');
                return;
            }

            try {
                let response = await updateProfile({billing: {firstName, lastName, address1, address2, city, state, country, postcode, phone}});
                setEditableBilling(false);
                toast.success(response.data);
                if(copyToShip) {
                    await updateProfile({shipping: {firstName, lastName, address1, address2, city, state, country, postcode, phone, phoneConfirmed: user.billing.phoneConfirmed}});
                    toast.success('Copy data succesfull');
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            setEditableBilling(true);
        }
    }

    const handleCancelBilEditing = () => {
        setEditableBilling(false);

        bilFirstNameRef.current.innerHTML = user.billing.firstName;
        bilLastNameRef.current.innerHTML = user.billing.lastName;
        bilAddress1Ref.current.innerHTML = user.billing.address1;
        bilAddress2Ref.current.innerHTML = user.billing.address2;
        bilCityRef.current.innerHTML = user.billing.city;
        bilStateRef.current.innerHTML = user.billing.state;
        bilCountryRef.current.innerHTML = user.billing.country;
        bilPostcodeRef.current.innerHTML = user.billing.postcode;
        bilPhoneRef.current.innerHTML = user.billing.phone;
    }

    const handlelCancelShipEditing = () => {
        setEditableShipping(false);

        shipFirstNameRef.current.innerHTML = user.shipping.firstName;
        shipLastNameRef.current.innerHTML = user.shipping.lastName;
        shipAddress1Ref.current.innerHTML = user.shipping.address1;
        shipAddress2Ref.current.innerHTML = user.shipping.address2;
        shipCityRef.current.innerHTML = user.shipping.city;
        shipStateRef.current.innerHTML = user.shipping.state;
        shipCountryRef.current.innerHTML = user.shipping.country;
        shipPostcodeRef.current.innerHTML = user.shipping.postcode;
        shipPhoneRef.current.innerHTML = user.shipping.phone;
    }

    const handleFillAddress = async (e, postcode) => {
        e.preventDefault();
        let latLng = await getLatLng(postcode);
        if(latLng.data.status === 'OK') {
            latLng = latLng.data.results[0].geometry.location;
            const address = await getAddress(latLng);
            if(address.data.results.length) {
                shipAddress1Ref.current.innerHTML = address.data.results[0].address_components[1].long_name;
                shipAddress2Ref.current.innerHTML = address.data.results[0].address_components[2].long_name;
                shipCityRef.current.innerHTML = address.data.results[0].address_components[3].long_name;
                shipStateRef.current.innerHTML = address.data.results[0].address_components[4].long_name;
                shipCountryRef.current.innerHTML = address.data.results[0].address_components[5].long_name;
                shipPostcodeRef.current.innerHTML = address.data.results[0].address_components[6].long_name;
            } else {
                toast.error('Address not found');
            }
        } else {
            toast.error('Address not found');
        }
    }

    const handleShippingClick = async () => {
        if(editableShipping) {
            const firstName = shipFirstNameRef.current.innerHTML.trim();
            const lastName = shipLastNameRef.current.innerHTML.trim();
            const address1 = shipAddress1Ref.current.innerHTML.trim();
            const address2 = shipAddress2Ref.current.innerHTML.trim();
            const city = shipCityRef.current.innerHTML.trim();
            const state = shipStateRef.current.innerHTML.trim();
            const country = shipCountryRef.current.innerHTML.trim();
            const postcode = shipPostcodeRef.current.innerHTML.trim();
            const phone = shipPhoneRef.current.innerHTML.trim();
            
            if(!firstName || !lastName || !address1 || !city || !state || !country || !postcode || !phone) {
                toast.warning('Missing fields');
                return;
            }

            try {
                let response = await updateProfile({shipping: {firstName, lastName, address1, address2, city, state, country, postcode, phone}});
                setEditableShipping(false);
                toast.success(response.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            setEditableShipping(true);
        }
    }

    return user._id ? (
        <div className='container-fluid mt-3'>
            <div className='row'>
                <div className='col-lg-2 offset-lg-1 col-md-2'>
                <div className="me-2 picture" style={{backgroundImage: `url(${user.profile_picture})`}}></div>
                </div>
                <div className='col-lg-4 col-md-5'>
                    <h5 className='d-inline'>Basic information</h5>
                     <div className='d-inline float-end'>
                        {editableBasic 
                        ?   <>
                            <button onMouseUp={handleBasicClick} style={{fontSize: '1.25rem'}} className='text-dark btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiSave />
                            </button>
                            <button 
                                onMouseUp={() => {
                                    setEditableBasic(false);
                                    fullNameRef.current.innerHTML = user.fullName;
                                }} style={{fontSize: '1.25rem'}} className='btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiX />
                            </button>
                            </>
                        :   <button onMouseUp={handleBasicClick} style={{fontSize: '1.25rem'}} className='text-dark btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiEdit />
                            </button>
                        }
                    </div>
                    <hr />
                    <p>Full name: <span ref={fullNameRef} className={editableBasic ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBasicKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBasic}`}>{user.fullName}</span></p>
                    <p>Store name: <span ref={storeNameRef} className={editableBasic ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBasicKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBasic}`}>{user.storeName}</span></p>
                    <p>Username: <span ref={usernameRef} className={editableBasic ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBasicKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBasic}`}>{user.username}</span></p>
                </div>
                <div className='col-lg-4 col-md-5'>
                    <h5 className='d-inline'>Contact information</h5>
                    <div className='d-inline float-end'>
                        {editableContact 
                        ?   <>
                            <button type='submit' form='form-contact' style={{fontSize: '1.25rem'}} className='text-dark btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiSave />
                            </button>
                            <button onMouseUp={() => setEditableContact(false)} style={{fontSize: '1.25rem'}} className='btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiX />
                            </button>
                            </>
                        :   <button onMouseUp={handleContactClick} style={{fontSize: '1.25rem'}} className='text-dark btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiEdit />
                            </button>
                        }
                    </div>
                    <hr/>
                    <p>Email: <span style={{display: editableContact ? 'none' : 'inline'}}>{user.email}</span>
                        <small className={user.emailConfirmed ? 'text-success' : 'text-danger'}><br />{user.emailConfirmed ? 'confirmed' : 'not confirmed'}</small>
                    </p>
                    <form id='form-contact' onSubmit={handleEmailSubmit}>
                        <input className='form-control' ref={emailRef} type="email" style={{display: editableContact ? 'inline' : 'none'}} />
                    </form>
                </div>
            </div>
            <div className='row'>
                <div className="col-lg-4 offset-lg-3 col-md-5 offset-md-2 mb-3">
                    <h5 className='d-inline'>Billing information</h5>
                    <div className='d-inline float-end'>
                        {editableBilling 
                        ?   <>
                            <button onMouseUp={handleBillingClick} style={{fontSize: '1.25rem'}} className='text-dark btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiSave />
                            </button>
                            <button onMouseUp={handleCancelBilEditing} style={{fontSize: '1.25rem'}} className='btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiX />
                            </button>
                            </>
                        :   <button onMouseUp={handleBillingClick} style={{fontSize: '1.25rem'}} className='text-dark btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiEdit />
                            </button>
                        }
                    </div>
                    {editableBilling
                    ?
                        <form className='d-flex mt-3' onSubmit={(e) => handleFillAddress(e, postcodeRef.current.value)}>
                            <input className='form-control me-2' ref={postcodeRef} type="text" placeholder='Postal Code #0000-000' />
                            <button type='submit' className='btn btn-success'>Search</button>
                        </form>
                    : null
                    }
                    <hr />
                    <p>First name: <span ref={bilFirstNameRef} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.firstName}</span></p>
                    <p>Last name: <span ref={bilLastNameRef} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.lastName}</span></p>
                    <p>Address 1: <span ref={bilAddress1Ref} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.address1}</span></p>
                    <p>Address 2: <span ref={bilAddress2Ref} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.address2}</span></p>
                    <p>City: <span ref={bilCityRef} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.city}</span></p>
                    <p>State: <span ref={bilStateRef} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.state}</span></p>
                    <p>Country: <span ref={bilCountryRef} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.country}</span></p>
                    <p>Postal code: <span ref={bilPostcodeRef} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.postcode}</span></p>
                    <p>Phone number: <span ref={bilPhoneRef} className={editableBilling ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleBillingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableBilling}`}>{user.billing.phone}</span>
                        <small className={user.billing.phoneConfirmed ? 'text-success' : 'text-danger'}><br />{user.billing.phoneConfirmed ? 'confirmed' : 'not confirmed'}</small>
                    </p>
                    <div className="form-check" style={{display: editableBilling ? 'inline' : 'none'}}>
                        <input onKeyPress={handleBillingKeyPress} className='form-check-input ms-1' id='isEquals' type="checkbox" ref={isShipEqualsRef} />
                        <label className="form-check-label" htmlFor="isEquals">
                            Copy to shipping information
                        </label>
                    </div>
                </div>
                <div className="col-lg-4 col-md-5">
                    <h5 className='d-inline'>Shipping information</h5>
                    <div className='d-inline float-end'>
                        {editableShipping 
                        ?   <>
                            <button onMouseUp={handleShippingClick} style={{fontSize: '1.25rem'}} className='text-dark btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiSave />
                            </button>
                            <button onMouseUp={handlelCancelShipEditing} style={{fontSize: '1.25rem'}} className='btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiX />
                            </button>
                            </>
                        :   <button onMouseUp={handleShippingClick} style={{fontSize: '1.25rem'}} className='text-dark btn btn-transparent p-0 m-0 shadow-none ms-3'>
                                <FiEdit />
                            </button>
                        }
                    </div>
                    <hr />
                    <p>First name: <span ref={shipFirstNameRef} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.firstName}</span></p>
                    <p>Last name: <span ref={shipLastNameRef} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.lastName}</span></p>
                    <p>Address 1: <span ref={shipAddress1Ref} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.address1}</span></p>
                    <p>Address 2: <span ref={shipAddress2Ref} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.address2}</span></p>
                    <p>City: <span ref={shipCityRef} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.city}</span></p>
                    <p>State: <span ref={shipStateRef} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.state}</span></p>
                    <p>Country: <span ref={shipCountryRef} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.country}</span></p>
                    <p>Postal code: <span ref={shipPostcodeRef} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.postcode}</span></p>
                    <p>Phone number: <span ref={shipPhoneRef} className={editableShipping ? 'border border-dark' : 'bg-light'}
                        onKeyPress={handleShippingKeyPress} suppressContentEditableWarning={true} contentEditable={`${editableShipping}`}>{user.shipping.phone}</span>
                        <small className={user.shipping.phoneConfirmed ? 'text-success' : 'text-danger'}><br />{user.shipping.phoneConfirmed ? 'confirmed' : 'not confirmed'}</small>
                    </p>
                </div>
            </div>
        </div>
    ) : null
}