import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { useGetBannersQuery } from '../slices/bannersApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const { data: banners } = useGetBannersQuery();

  if (banners && banners.length > 0) {
    const sorted = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));
    return (
      <Carousel pause='hover' className='bg-primary mb-4'>
        {sorted.map((banner) => (
          <Carousel.Item key={banner._id}>
            <Link to={banner.link}>
              <div className='banner-wrapper'>
                <Image src={banner.image} alt='banner' fluid className='banner-img' />
              </div>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2 className='text-white text-right'>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
