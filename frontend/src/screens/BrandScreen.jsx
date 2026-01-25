import { useParams, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const BrandScreen = () => {
  const { brandId, pageNumber } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useGetProductsQuery({ brand: brandId, pageNumber: pageNumber || 1 });

  const brandName = data?.products?.[0]?.brand?.name;

  return (
    <>
      <Meta
        title={
          brandName ? `${brandName} Products | Surgical Mart Nepal` : 'Brand | Surgical Mart Nepal'
        }
        description={`Browse products for ${brandName || 'brand'} at Surgical Mart Nepal.`}
      />
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h1 className='mb-0'>{brandName || 'Brand Products'}</h1>
        <Link to='/' className='btn btn-light btn-sm'>
          Go Back
        </Link>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Row className='g-3'>
            {data?.products?.length === 0 && (
              <Col>
                <Message>No products found for this brand.</Message>
              </Col>
            )}
            {data?.products?.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <div className='mt-3'>
            <Paginate
              pages={data.pages}
              page={data.page}
              isAdmin={false}
              keyword=''
              brand={brandId}
            />
          </div>
        </>
      )}
    </>
  );
};

export default BrandScreen;
