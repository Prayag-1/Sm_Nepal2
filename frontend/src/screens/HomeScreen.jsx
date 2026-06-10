import { Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Message from '../components/Message';
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

  useGetProductsQuery({
    keyword,
    pageNumber,
    category: selectedCategory || undefined,
    brand: selectedBrand || undefined,
  });

  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();
  const { data: featured } = useGetFeaturedProductsQuery();
  const { data: settings } = useGetSettingsQuery();
  const popularCategories =
    (categories || []).filter((cat) => !cat.parentCategory).slice(0, 12);

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

      {/* Hero */}
      <section className='home-hero fade-in'>
        <div className='home-hero__copy'>
          <div className='promo-pill'>
            <span className='promo-dot' />
            {settings?.promoText || 'Your trusted partner for medical supplies'}
          </div>
          <p className='eyebrow mb-2'>{settings?.tagline || 'Medical procurement, simplified'}</p>
          <h1 className='hero-title'>
            {settings?.siteName || 'Surgical Mart Nepal'}
          </h1>
          <p className='hero-subtitle'>
            {settings?.homepageNote ||
              'Trusted medical supplies for hospitals, clinics, and care teams across Nepal.'}
          </p>
          <div className='hero-cta-row'>
            <Button as={Link} to='/' variant='primary' size='lg' className='btn-cta'>
              Shop Medical Equipment
            </Button>
            <Button
              as={Link}
              to={`/category/${
                categories?.find((cat) => !cat.parentCategory)?._id || categories?.[0]?._id || ''
              }`}
              variant='outline-light'
              size='lg'
              className='btn-ghost'
            >
              Browse Categories
            </Button>
          </div>
          <div className='hero-trust'>
            <div className='trust-chip'>Hospitals & Clinics</div>
            <div className='trust-chip'>Genuine Brands</div>
            <div className='trust-chip'>Nationwide Delivery</div>
          </div>
        </div>
        <div className='home-hero__visual'>
          <div className='hero-card'>
            <div className='hero-card__badge'>Premium</div>
            <div className='hero-card__title'>Hospital-grade devices</div>
            <div className='hero-card__meta'>Sterile •  certified Products • Ready to ship</div>
            <div className='hero-card__cta'>Explore inventory →</div>
          </div>
          <div className='hero-illus' aria-hidden='true'>
            <div className='illus-pill illus-pill--1' />
            <div className='illus-pill illus-pill--2' />
            <div className='illus-pill illus-pill--3' />
          </div>
        </div>
      </section>

      <div className='content-container'>
        <section className='section-block filters mb-4 fade-in'>
          <div className='filter-card'>
            <div className='filter-field'>
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
            </div>
            <div className='filter-field'>
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
            </div>
          </div>
        </section>

        {/* Featured categories - fast scan */}
        <section className='section-block fade-in'>
          <div className='section-header section-header--split'>
            <div>
              <h2>Featured Categories</h2>
              <p>Most-searched equipment and supplies this week.</p>
            </div>
            <Button as={Link} to='/categories' variant='outline-primary' size='sm'>
              View all categories
            </Button>
          </div>
          <div className='category-scroll'>
            {popularCategories.map((cat, idx) => (
              <Link key={cat._id} to={`/category/${cat._id}`} className='category-card-premium'>
                <div className='category-card__top'>
                  <div className='category-thumb-ghost'>{cat.name?.[0] || '?'}</div>
                  <span className='category-chip'>{idx < 3 ? 'Top selling' : 'Popular'}</span>
                </div>
                <div className='category-card__name text-truncate'>{cat.name}</div>
                <span className='category-card__cta'>Browse →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className='section-block fade-in'>
          <div className='section-header section-header--split'>
            <div>
              <h2>Today&apos;s Deals</h2>
              <p>Handpicked medical essentials ready to ship.</p>
            </div>
            <Button as={Link} to='/' variant='outline-primary' size='sm'>
              View all deals
            </Button>
          </div>
          {featured && featured.length > 0 ? (
            <Row className='g-3 product-grid'>
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

        <section className='section-block fade-in' id='categories'>
          <div className='section-header mb-3'>
            <h2>Shop by Category</h2>
            <p>Discover equipment and consumables organized for quick decisions.</p>
          </div>
          <div className='category-grid'>
            {(categories || [])
              .filter((cat) => !cat.parentCategory)
              .map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat._id}`}
                  className='category-tile'
                >
                  <div className='category-icon'>{cat.name?.[0] || '?'}</div>
                  <div className='category-name text-truncate'>{cat.name}</div>
                  <span className='category-cta'>View items →</span>
                </Link>
              ))}
          </div>
        </section>

        <section className='section-block fade-in' id='brands'>
          <div className='section-header section-header--center mb-3'>
            <h2>Trusted Brands</h2>
            <p className='mb-0'>Partnered with leading manufacturers across Nepal and beyond.</p>
          </div>
          <div className='brand-ribbon'>
            {(brands || []).map((brand) => (
              <Link
                key={brand._id}
                to={`/brand/${brand._id}`}
                className='brand-chip text-decoration-none'
              >
                {brand.image || brand.logo ? (
                  <img src={brand.image || brand.logo} alt={brand.name} loading='lazy' />
                ) : (
                  <span className='brand-initial'>{brand.name?.[0] || '?'}</span>
                )}
                <span>{brand.name}</span>
              </Link>
            ))}
          </div>
          <div className='text-center mt-3'>
            <Button as={Link} to='/brands' variant='outline-primary' size='sm'>
              View all brands
            </Button>
          </div>
        </section>

        <section className='section-block fade-in trust-panel'>
          <div className='section-header mb-3'>
            <h2>Why Surgical Mart Nepal?</h2>
            <p>Built for hospitals, clinics, labs, and pharmacies that need reliable supply.</p>
          </div>
          <div className='trust-grid'>
            <div className='trust-card'>
              <h5>Clinical-grade catalog</h5>
              <p>Curated inventory from certified suppliers with documentation on request.</p>
            </div>
            <div className='trust-card'>
              <h5>Procurement made simple</h5>
              <p>Transparent pricing, fast reordering, and expert support when you need it.</p>
            </div>
            <div className='trust-card'>
              <h5>Nationwide logistics</h5>
              <p>Cold-chain aware delivery partners covering major cities and remote regions.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeScreen;
