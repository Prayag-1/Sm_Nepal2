import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { useGetBrandsQuery } from '../slices/brandsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const BrandsListScreen = () => {
  const { data: brands, isLoading, error } = useGetBrandsQuery();

  if (isLoading) return <Loader />;
  if (error)
    return <Message variant='danger'>{error?.data?.message || 'Failed to load brands'}</Message>;

  return (
    <Container className='content-container py-4'>
      <div className='section-header text-center mb-3'>
        <h2>All Brands</h2>
        <p className='mb-0'>Browse every brand available on Surgical Mart Nepal.</p>
      </div>
      {brands && brands.length > 0 ? (
        <>
          <div className='brand-card-grid mb-3'>
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/brand/${brand._id}`}
                className='brand-card text-center text-decoration-none'
              >
                <div className='brand-card-img'>
                  {brand.image || brand.logo ? (
                    <img src={brand.image || brand.logo} alt={brand.name} loading='lazy' />
                  ) : (
                    <span className='brand-initial'>{brand.name?.[0] || '?'}</span>
                  )}
                </div>
                <div className='text-muted small mt-2'>{brand.name}</div>
              </Link>
            ))}
          </div>
          <div className='text-center'>
            <Button as={Link} to='/' variant='outline-primary' size='sm'>
              Back to Home
            </Button>
          </div>
        </>
      ) : (
        <Message variant='info'>No brands available.</Message>
      )}
    </Container>
  );
};

export default BrandsListScreen;
