import React, { useState, useEffect, useRef } from 'react';
import {loggedin, updateProfile, updateEmail, getLatLng, getAddress, uploadFile} from '../api';
import {FiEdit, FiSave, FiX} from 'react-icons/fi';
import './Profile.css';
import { toast } from 'react-toastify';

export default function Profile() {
    const [user, setUser] = useState({});
    const [editableBasic, setEditableBasic] = useState(false);
    const [editableContact, setEditableContact] = useState(false);
    const [editableBilling, setEditableBilling] = useState(false);
    const [editableShipping, setEditableShipping] = useState(false);
    const [canChangePic, setCanChangePic] = useState(false);
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
        if(e.target.innerHTML.length > 200) {
            e.preventDefault();
        }

        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            handleBasicClick();
        }
    }

    const handleBillingKeyPress = (e) => {
        if(e.target.innerHTML.length > 200) {
            e.preventDefault();
        }

        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            handleBillingClick();
        }
    }

    const handleShippingKeyPress = (e) => {
        if(e.target.innerHTML.length > 200) {
            e.preventDefault();
        }

        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            handleShippingClick();
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value.trim().replace(/&nbsp;/g, '');
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
            const fullName = fullNameRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const storeName = storeNameRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const username = usernameRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            
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
            const firstName = bilFirstNameRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const lastName = bilLastNameRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const address1 = bilAddress1Ref.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const address2 = bilAddress2Ref.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const city = bilCityRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const state = bilStateRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const country = bilCountryRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const postcode = bilPostcodeRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const phone = bilPhoneRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const copyToShip = isShipEqualsRef.current.checked;

            if(state.length !== 2) {
                toast.warning('State must have 2 letters');
                return;
            }

            if(!firstName || !lastName || !address1 || !city || !state || !country || !postcode || !phone) {
                toast.warning('Missing fields');
                return;
            }

            try {
                let response = await updateProfile({billing: {firstName, lastName, address1, address2, city, state, country, postcode, phone}});
                setEditableBilling(false);
                toast.success(response.data);
                if(copyToShip) {
                    shipFirstNameRef.current.innerHTML = firstName;
                    shipLastNameRef.current.innerHTML = lastName;
                    shipAddress1Ref.current.innerHTML = address1;
                    shipAddress2Ref.current.innerHTML = address2;
                    shipCityRef.current.innerHTML = city;
                    shipStateRef.current.innerHTML = state;
                    shipCountryRef.current.innerHTML = country;
                    shipPostcodeRef.current.innerHTML = postcode;
                    shipPhoneRef.current.innerHTML = phone;
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

    const handleFillBillingAddress = async (e, postcode) => {
        e.preventDefault();
        let latLng = await getLatLng(postcode);
        if(latLng.data.status === 'OK') {
            latLng = latLng.data.results[0].geometry.location;
            const address = await getAddress(latLng);
            if(address.data.results.length) {
                bilAddress1Ref.current.innerHTML = `${address.data.results[0].address_components[1].long_name}, number`;
                bilAddress2Ref.current.innerHTML = address.data.results[0].address_components[2].long_name;
                
                if(address.data.results[0].address_components.length === 6) {
                    bilCityRef.current.innerHTML = address.data.results[0].address_components[3].long_name;
                    bilCountryRef.current.innerHTML = address.data.results[0].address_components[4].long_name;
                    bilPostcodeRef.current.innerHTML = address.data.results[0].address_components[5].long_name
                } else {
                    bilCityRef.current.innerHTML = address.data.results[0].address_components[3].long_name;
                    bilStateRef.current.innerHTML = address.data.results[0].address_components[4].short_name;
                    bilCountryRef.current.innerHTML = address.data.results[0].address_components[5].long_name;
                    bilPostcodeRef.current.innerHTML = address.data.results[0].address_components[6].long_name;
                }
            } else {
                toast.error('Address not found');
            }
        } else {
            toast.error('Address not found');
        }
    }

    const handleFillShippingAddress = async (e, postcode) => {
        e.preventDefault();
        let latLng = await getLatLng(postcode);
        if(latLng.data.status === 'OK') {
            latLng = latLng.data.results[0].geometry.location;
            const address = await getAddress(latLng);
            if(address.data.results.length) {
                shipAddress1Ref.current.innerHTML = `${address.data.results[0].address_components[1].long_name}, number`;
                shipAddress2Ref.current.innerHTML = address.data.results[0].address_components[2].long_name;
                
                if(address.data.results[0].address_components.length === 6) {
                    shipCityRef.current.innerHTML = address.data.results[0].address_components[3].long_name;
                    shipCountryRef.current.innerHTML = address.data.results[0].address_components[4].long_name;
                    shipPostcodeRef.current.innerHTML = address.data.results[0].address_components[5].long_name
                } else {
                    shipCityRef.current.innerHTML = address.data.results[0].address_components[3].long_name;
                    shipStateRef.current.innerHTML = address.data.results[0].address_components[4].short_name;
                    shipCountryRef.current.innerHTML = address.data.results[0].address_components[5].long_name;
                    shipPostcodeRef.current.innerHTML = address.data.results[0].address_components[6].long_name;
                }
            } else {
                toast.error('Address not found');
            }
        } else {
            toast.error('Address not found');
        }
    }

    const handlePostcodeInput = (e) => {
        if(/^([0-9]{5}|[a-zA-Z][a-zA-Z ]{0,49})$/.test(e.code) && e.code !== 'Backspace' 
            && e.code !== 'ArrowLeft' && e.code !== 'ArrowRight' && e.code !== 'Delete' && e.code !== 'Enter') {
            e.preventDefault();
        }
    }

    //for smartphone
    const handlePostcodeOnInput = (e) => {
        alert(JSON.stringify(e));
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            if(/^([0-9]{5}|[a-zA-Z][a-zA-Z ]{0,49})$/.test(e.nativeEvent.data) &&  e.nativeEvent.inputType !== "deleteContentBackward") {
                e.preventDefault();
            }
        }
    }

    const handleShippingClick = async () => {
        if(editableShipping) {
            const firstName = shipFirstNameRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const lastName = shipLastNameRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const address1 = shipAddress1Ref.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const address2 = shipAddress2Ref.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const city = shipCityRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const state = shipStateRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const country = shipCountryRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const postcode = shipPostcodeRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            const phone = shipPhoneRef.current.innerHTML.trim().replace(/&nbsp;/g, '');
            
            if(state.length !== 2) {
                toast.warning('State must have 2 letters');
                return;
            }

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

    const handleChangePicture = async (e) => {
        const image = e.target.files[0];
        if(! image) {
            setCanChangePic(false);
            return;
        }

        try {
            const uploadData = new FormData();
            uploadData.append('file', image);
            //returns image_url after upload
            let response = await uploadFile(uploadData);

            const newData = {profile_picture: response.data.fileUrl};

            await updateProfile(newData);

            response = await loggedin();
            if(response.data._id) {
                setUser(response.data);
            }
            setCanChangePic(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCanChangePic = () => {
        setCanChangePic(true);
    }

    return user._id ? (
        <div className='container-fluid mt-3'>
            <div className='row'>
                <div className='col-lg-2 offset-lg-1 col-md-2 text-center'>
                    <div className="me-2 picture" style={{backgroundImage: `url(${user.profile_picture})`}}></div>
                    <div className='mt-3'>
                        {
                            canChangePic
                            ?<input onChange={handleChangePicture} className='form-control form-control-sm' type="file" name='profile-pic' id='profile-pic' />
                            :<button onClick={handleCanChangePic} className='btn btn-warning btn-sm'>Change Picture</button>
                        }
                    </div>
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
                                    storeNameRef.current.innerHTML = user.storeName;
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
                        <input className='form-control' ref={emailRef} type="email" maxLength='200' style={{display: editableContact ? 'inline' : 'none'}} />
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
                        <form className='d-flex mt-3' onSubmit={(e) => handleFillBillingAddress(e, postcodeRef.current.value)}>
                            <input onInput={handlePostcodeOnInput} onKeyDown={handlePostcodeInput} className='form-control me-2' ref={postcodeRef} type="text" placeholder='Postal Code #0000000' />
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
                    {editableShipping
                    ?
                        <form className='d-flex mt-3' onSubmit={(e) => handleFillShippingAddress(e, postcodeRef.current.value)}>
                            <input onInput={handlePostcodeOnInput} onKeyDown={handlePostcodeInput} className='form-control me-2' ref={postcodeRef} type="text" placeholder='Postal Code #0000000' />
                            <button type='submit' className='btn btn-success'>Search</button>
                        </form>
                    : null
                    }
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