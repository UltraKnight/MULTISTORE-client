import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import type { Order } from 'src/types/order';
import type { User } from 'src/types/user';
import { addComment, getSales, loggedin, updateProduct, updateStatus } from '../../api';

export default function SalesTab({ activeTab }: { activeTab: number }) {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User>({});
  const [sales, setSales] = useState<Order[]>([]);
  const [selectedSale, setSelectedSale] = useState<Order | null>(null);
  const [status, setStatus] = useState('');
  const commentRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const salesResponse = await getSales();
      setSales(salesResponse.data);
      setStatus('');

      const userResponse = await loggedin();
      if (userResponse.data._id) {
        setUser(userResponse.data);
      }
      setLoading(false);
    }
    if (isMounted) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const { id } = e.currentTarget;
    const foundSale = sales.find((item) => item._id === id);
    if (!foundSale) {
      toast.warning('Sale not found');
      return;
    }
    setStatus('');
    setSelectedSale(foundSale);
  };

  const handleAddCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const comment = commentRef.current?.value;

    if (!comment) {
      toast.warning('Add a comment...');
      setLoading(false);
      return;
    }

    try {
      if (!(selectedSale?._id && selectedSale?.client)) {
        toast.warning('Select a sale');
        setLoading(false);
        return;
      }

      await addComment(selectedSale._id, (selectedSale.client as User)._id!, comment);
      toast.success('Comment published');

      const response = await getSales();
      setSales(response.data);

      const updatedSale = response.data.find((item) => item._id === selectedSale._id);
      if (!updatedSale) {
        toast.warning('Updated sale not found');
        setLoading(false);
        return;
      }

      setSelectedSale(updatedSale);

      e.currentTarget.reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!status) {
      toast.warning('Select the new status');
      setLoading(false);
      return;
    }

    if (!selectedSale?._id) {
      toast.warning('Select a sale');
      setLoading(false);
      return;
    }

    try {
      //update the status of the order
      await updateStatus(selectedSale._id, { status: status });
      toast.success(`Status changed to ${status}`);

      //get the updated orders
      const response = await getSales();
      setSales(response.data);

      //get the updated sale from DB
      const updatedSale = response.data.find((item) => item._id === selectedSale._id);
      if (!updatedSale) {
        toast.warning('Updated sale not found');
        setLoading(false);
        return;
      }
      setSelectedSale(updatedSale);

      //reassign the removed products quantity when the status is canceled
      if (status === 'Canceled') {
        selectedSale.products?.forEach(async (item) => {
          if (typeof item.product === 'string' || !item.product._id || !item.product.quantity) {
            console.warn('Error updating product quantity, please refresh the page');
            return;
          }
          await updateProduct({ quantity: item.product.quantity + item.quantity }, item.product._id);
        });
      }

      setStatus('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return !loading ? (
    <div
      className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`}
      id='sales'
      role='tabpanel'
      aria-labelledby='sales-tab'
    >
      <div className='row'>
        <div className='col-md-3 my-3'>
          <div className='mb-3'>
            <h3>
              Total earned: &euro;{' '}
              {sales.reduce((accumulator, current) => {
                const isSaleCompleted = current?.status !== 'Canceled' && current?.status !== 'Pending';
                return accumulator + (isSaleCompleted ? current.total! : 0);
              }, 0)}
            </h3>
            <button
              className='btn btn-sm btn-warning shadow-none'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseSales'
              aria-expanded='false'
              aria-controls='collapseSales'
            >
              My Sales
            </button>
            <div className='collapse mt-3 show' id='collapseSales'>
              <ul className='list-group'>
                {sales.length ? (
                  sales.map((sale) => {
                    return (
                      <li
                        key={sale._id}
                        id={sale._id}
                        role='button'
                        onClick={handleSaleClick}
                        className={`list-group-item d-flex justify-content-between align-items-center list-custom ${
                          selectedSale && (sale._id === selectedSale._id ? 'active' : '')
                        }`}
                      >
                        {`${sale.products?.length} product(s) - ${
                          sale.orderDate && new Date(sale.orderDate).toLocaleDateString()
                        } - Client ${(sale.client as User)?.storeName ?? (sale.client as User).fullName}`}
                      </li>
                    );
                  })
                ) : (
                  <li>Nothing here</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className='col-md-7 my-3'>
          {selectedSale && selectedSale._id ? (
            <>
              <h3>Sale details</h3>
              <h5>Products</h5>
              {selectedSale.products?.map((product) => {
                if (typeof product.product !== 'string')
                  return (
                    <p key={product.product._id}>
                      {`${product.product.name}`} - &euro;{' '}
                      {`${product.product.price?.toFixed(2)} - quantity: ${product.quantity}`}
                    </p>
                  );
              })}
              <p>
                <strong>Order date: </strong>
                <span>{selectedSale.orderDate && new Date(selectedSale.orderDate).toLocaleDateString()}</span>
              </p>
              <p>
                <strong>Client Name: </strong>
                <span>{(selectedSale.client as User)?.fullName}</span>
              </p>
              <p>
                <strong>Client's store name: </strong>
                <span>{(selectedSale.client as User)?.storeName}</span>
              </p>
              <p>
                <strong>Total: </strong>&euro; <span>{selectedSale.total?.toFixed(2)}</span>
              </p>

              <hr />
              {typeof selectedSale.client !== 'string' && selectedSale.client?.shipping ? (
                <>
                  <button
                    className='btn btn-sm btn-warning shadow-none'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseShipping'
                    aria-expanded='false'
                    aria-controls='collapseShipping'
                  >
                    Shipping data
                  </button>
                  <div className='collapse mt-3' id='collapseShipping'>
                    <ul className='list-group'>
                      <p>
                        <strong>First Name: </strong>
                        {selectedSale.client.shipping.firstName}
                      </p>
                      <p>
                        <strong>Last Name: </strong>
                        {selectedSale.client.shipping.lastName}
                      </p>
                      <p>
                        <strong>Address: </strong>
                        {selectedSale.client.shipping.address1} - {selectedSale.client.shipping.address2}
                      </p>
                      <p>
                        <strong>City: </strong>
                        {selectedSale.client.shipping.city}
                      </p>
                      <p>
                        <strong>State: </strong>
                        {selectedSale.client.shipping.state}
                      </p>
                      <p>
                        <strong>Country: </strong>
                        {selectedSale.client.shipping.country}
                      </p>
                      <p>
                        <strong>Postal Code: </strong>
                        {selectedSale.client.shipping.postcode}
                      </p>
                    </ul>
                  </div>
                  <hr />
                </>
              ) : null}

              {/* 'Pending', 'Confirmed', 'Canceled', 'Refunded', 'In transit', 'Delivered', 'Processing' */}
              {selectedSale.status !== 'Canceled' && selectedSale.status !== 'Delivered' ? (
                <form onSubmit={handleUpdateStatusSubmit} className='mb-3'>
                  <div className='mb-3'>
                    <label className='form-label' htmlFor='status'>
                      Current status: <span>{selectedSale.status}</span>
                    </label>
                    <select
                      value={status}
                      id='status'
                      onChange={handleSaleChange}
                      className='form-select'
                      aria-label='select status'
                    >
                      <option disabled value=''>
                        Select the new status
                      </option>
                      <option value='Pending'>Pending</option>
                      <option value='Processing'>Processing</option>
                      <option value='Confirmed'>Confirmed</option>
                      <option value='Canceled'>Cancelled*</option> // TODO: fix typo in Canceled
                      <option value='Refunded'>Refunded</option>
                      <option value='In transit'>In transit</option>
                      <option value='Delivered'>Delivered*</option>
                    </select>
                    <small>* can't be undone</small>
                  </div>
                  <button type='submit' className='btn btn-sm btn-outline-success border border-dark me-2'>
                    Update Status
                  </button>
                </form>
              ) : (
                <p>
                  <strong>Current status: </strong>
                  {selectedSale.status}
                </p>
              )}

              <hr />
              <div className='rounded px-2' style={{ backgroundColor: 'rgba(255, 244, 199, 0.3)' }}>
                <h5>Comments:</h5>
                {selectedSale.comments?.map((comment) => {
                  if (typeof comment.author !== 'string' && typeof comment.to !== 'string')
                    return comment.to._id === user._id || comment.author._id === user._id ? (
                      <ul key={comment._id}>
                        <li>
                          <strong>{comment.author.fullName}</strong>
                        </li>
                        <li>{comment.comment}</li>
                        <li>
                          Date: {new Date(comment.date).toLocaleDateString()} -{' '}
                          {new Date(comment.date).toLocaleTimeString()}
                        </li>
                      </ul>
                    ) : null;
                })}
                <form onSubmit={handleAddCommentSubmit}>
                  <div className='mb-3'>
                    <label className='form-label' htmlFor='comment'>
                      Add a comment/answer
                    </label>
                    <textarea
                      ref={commentRef}
                      className='form-control'
                      name='comment'
                      id='comment'
                      placeholder='Your message to the client... (be careful, you cannot delete the sent messages)'
                    ></textarea>
                  </div>
                  <button type='submit' className='btn btn-sm btn-outline-success border border-dark me-2'>
                    Post
                  </button>
                </form>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  ) : (
    <div className='text-center mb-3'>
      <h2>Loading...</h2>
    </div>
  );
}
