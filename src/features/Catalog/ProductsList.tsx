import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import type { Product } from 'src/types/product';
import type { User } from 'src/types/user';
import { getProducts, getProductsByCategory } from '../../api';
import AiAssistant from './AiAssistant';
import LoadingSpinner from 'src/ui/LoadingSpinner';

// can receive a category or query to filter the products
export default function ProductsList() {
  const params = useParams();
  const category = params?.categoryId;
  const search = useLocation().search;
  const searchQuery = new URLSearchParams(search).get('query');
  const [products, setProducts] = useState<Product[]>([]);
  const [highlights, setHighlights] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);
  const carouselItemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = searchQuery
        ? await getProducts(searchQuery) // get products by search query
        : category
          ? await getProductsByCategory(category) // get products by category
          : await getProducts(); // get all products if no filter is applied

      setProducts(response.data);

      if (response.data.length) {
        const randomProducts: Product[] = [];
        const randomIndexes: number[] = [];
        while (randomIndexes.length < Math.min(3, response.data.length)) {
          const index = Math.floor(Math.random() * response.data.length);
          if (!randomIndexes.includes(index)) {
            randomIndexes.push(index);
          }
        }
        randomProducts.push(...randomIndexes.map((index) => response.data[index]));
        setHighlights(randomProducts);
      }

      setLoading(false);
    }
    fetchData();
  }, [category, searchQuery]);

  const getProductFrom = (createdBy?: string | User) => {
    let result = 'n/a';
    if (typeof createdBy !== 'string') {
      const state = createdBy?.billing?.state ? createdBy.billing.state : 'n/a';
      const country = createdBy?.billing?.country ? createdBy.billing.country : '';
      result = `${state} - ${country}`;
    }
    return result;
  };

  if (loading) return <LoadingSpinner />;

  return products.length ? (
    <>
      {highlights.length ? (
        <div className='col-md-6 offset-md-3'>
          {/* carousel */}
          <div id='carouselHighlights' className='carousel slide' data-bs-ride='carousel'>
            <div className='carousel-indicators'>
              {highlights.map((_, index) => (
                <button
                  key={index}
                  type='button'
                  data-bs-target='#carouselHighlights'
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : undefined}
                  aria-label={`Slide ${index + 1}`}
                  ref={(el) => {
                    if (el) buttonRefs.current[index] = el;
                  }}
                ></button>
              ))}
            </div>
            <div className='carousel-inner'>
              {highlights.map((highlight, index) => (
                <div
                  className={`carousel-item ${index === 0 ? 'active' : ''}`}
                  key={index}
                  ref={(el) => {
                    if (el) carouselItemsRef.current[index] = el;
                  }}
                >
                  <Link to={`/products/${highlight._id}`}>
                    <img src={highlight.image_url} className='d-block w-50 h-25 mx-auto' alt={highlight.name} />
                  </Link>
                  <div className='carousel-caption d-none d-md-block pb-3'>
                    <p
                      className='pb-0 px-3 mb-1 mx-auto rounded'
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', width: 'fit-content' }}
                    >
                      {highlight.name}
                    </p>
                    <Link to={`/products/${highlight._id}`} className='btn btn-primary btn-small'>
                      See product
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <button
              className='carousel-control-prev'
              type='button'
              data-bs-target='#carouselHighlights'
              data-bs-slide='prev'
            >
              <span
                className='carousel-control-prev-icon'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                aria-hidden='true'
              ></span>
              <span className='visually-hidden'>Previous</span>
            </button>
            <button
              className='carousel-control-next'
              type='button'
              data-bs-target='#carouselHighlights'
              data-bs-slide='next'
            >
              <span
                className='carousel-control-next-icon'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                aria-hidden='true'
              ></span>
              <span className='visually-hidden'>Next</span>
            </button>
          </div>
        </div>
      ) : null}

      <div
        className='d-grid gap-4 py-3 justify-content-center'
        style={{ gridTemplateColumns: 'repeat(auto-fit, minMax(20rem, max-content))', maxWidth: '100vw' }}
      >
        {products.map((product) => {
          return product.quantity! > 0 ? (
            <Link key={product._id} style={{ textDecoration: 'none' }} to={`/products/${product._id}`}>
              <div
                className='card pt-3 bg-white border-0 text-center mt-2'
                style={{ width: '20rem', height: '380px', boxShadow: '2px 2px 6px #888888' }}
              >
                <img
                  className='card-img-top img-fluid mx-auto'
                  src={product.image_url}
                  alt={product.name}
                  loading='lazy'
                  style={{ maxHeight: '150px', width: 'auto' }}
                />
                <div className='card-body d-flex flex-column justify-content-between'>
                  <h5 className='card-title'>
                    <p>{product.name!.length > 80 ? `${product.name!.substring(0, 75)}...` : product.name}</p>
                  </h5>
                  <section>
                    <p className='card-text m-0'>
                      <small className='text-muted'>available: {product.quantity}</small>
                    </p>
                    <p className='card-text'>
                      <small className='text-muted'>From: {getProductFrom(product.createdBy)}</small>
                    </p>
                    <h4 className='card-text text-dark'>&euro; {product.price!.toFixed(2)}</h4>
                  </section>
                </div>
              </div>
            </Link>
          ) : (
            <div
              key={product._id}
              className='card pt-3 bg-white border-0 text-center mt-2'
              style={{ width: '20rem', height: '380px', boxShadow: '2px 2px 6px #888888' }}
            >
              <img
                className='card-img-top img-fluid mx-auto'
                src='/images/multistore-logo.png'
                alt=''
                style={{ maxHeight: '150px', width: 'auto' }}
              />
              <div className='card-body'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-text'>
                  <small className='text-muted'>not available</small>
                </p>
                <h4 className='card-text'>&euro; {product.price!.toFixed(2)}</h4>
              </div>
            </div>
          );
        })}
      </div>
      <AiAssistant products={products} />
    </>
  ) : (
    <p className='m-3'>
      No products found for this category. Go back to <Link to='/'>Home</Link>
    </p>
  );
}
