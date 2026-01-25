import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { useGetBrandsQuery } from '../slices/brandsApiSlice';
import ProductCarousel from '../components/ProductCarousel';
import { useGetFeaturedProductsQuery } from '../slices/productsApiSlice';
import { useGetSettingsQuery } from '../slices/contactApiSlice';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category: selectedCategory || undefined,
    brand: selectedBrand || undefined,
  });

  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();
  const { data: featured } = useGetFeaturedProductsQuery();
  const { data: settings } = useGetSettingsQuery();

  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    params.delete('pageNumber');
    setSearchParams(params);
  };

  return (
    <>
      <Meta />
      {!keyword && <ProductCarousel />}
      {keyword && (
        <div className='content-container'>
          <Link to='/' className='btn btn-light mb-4'>
            Go Back
          </Link>
        </div>
      )}

      <div className='hero wide-hero'>
        <div className='content-container hero-inner'>
          <div>
            <p className='eyebrow'>{settings?.tagline || 'Trusted Medical Supply Hub'}</p>
            <h1>{settings?.siteName || 'Surgical Mart Nepal'}</h1>
            <p className='lead'>
              {settings?.homepageNote ||
                'Clinician-grade equipment, consumables, and rehabilitation support delivered with care across Nepal.'}
            </p>
            <div className='d-flex flex-wrap gap-2'>
              <Button
                variant='primary'
                as={Link}
                to={selectedCategory ? `/category/${selectedCategory}` : '/'}
              >
                Shop Now
              </Button>
              {categories && categories.length > 0 && (
                <Button
                  variant='outline-primary'
                  as={Link}
                  to={`/category/${
                    categories.find((cat) => !cat.parentCategory)?._id ||
                    categories[0]._id
                  }`}
                >
                  Browse Categories
                </Button>
              )}
            </div>
          </div>
          <div className='hero-stats'>
            <div>
              <span className='stat-number'>24/7</span>
              <p>Order Support</p>
            </div>
            <div>
              <span className='stat-number'>+50</span>
              <p>Trusted Brands</p>
            </div>
            <div>
              <span className='stat-number'>Nepal</span>
              <p>Nationwide Delivery</p>
            </div>
          </div>
        </div>
      </div>

      <div className='content-container'>
        <section className='section-block filters mb-4'>
          <Row>
            <Col md={4} className='mb-2'>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value=''>All Categories</option>
                {(categories || [])
                  .filter((cat) => !cat.parentCategory)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Form.Select>
            </Col>
            <Col md={4} className='mb-2'>
              <Form.Select
                value={selectedBrand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <option value=''>All Brands</option>
                {(brands || []).map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </section>

        <section className='section-block'>
          <div className='section-header'>
            <h2>Today&apos;s Deals</h2>
            <p>Handpicked medical essentials ready to ship.</p>
          </div>
          {featured && featured.length > 0 ? (
            <Row>
              {featured.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <Message variant='info'>No deals selected.</Message>
          )}
        </section>

        <section className='section-block' id='brands'>
          <div className='section-header text-center mb-3'>
            <h2>Popular Brands</h2>
            <p className='mb-0'>Trusted manufacturers and partners across Nepal.</p>
          </div>
          <div className='brand-card-grid'>
            {(brands || []).map((brand) => (
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
          <div className='text-center mt-3'>
            <Button as={Link} to='/?view=brands' variant='outline-primary'>
              View All Brands &rarr;
            </Button>
          </div>
        </section>

        <section className='section-block' id='categories'>
          <div className='section-header mb-3'>
            <h2>Medical Categories</h2>
            <p>Discover our range of medical supplies and equipment organized by specialty.</p>
          </div>
          <Row className='g-3 category-card-grid'>
            {(categories || [])
              .filter((cat) => !cat.parentCategory)
              .map((cat) => (
                <Col key={cat._id} xs={6} sm={4} md={3} lg={3} xl={2}>
                  <Card className='category-card h-100 text-center'>
                    <Card.Body className='py-3 d-flex flex-column justify-content-center'>
                      <Card.Title className='fs-6 text-uppercase text-truncate mb-2'>
                        {cat.name}
                      </Card.Title>
                      <Button
                        as={Link}
                        to={`/category/${cat._id}`}
                        variant='light'
                        className='border-0 border-top'
                        size='sm'
                      >
                        View
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </section>
      </div>
    </>
  );
};

export default HomeScreen;
