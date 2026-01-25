import { Row, Col, Form } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import { useGetBrandsQuery } from '../slices/brandsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import BreadcrumbNav from '../components/BreadcrumbNav';
import Meta from '../components/Meta';

const CategoryScreen = () => {
  const { categoryId, pageNumber } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBrand = searchParams.get('brand') || '';
  const selectedSubcategory = searchParams.get('subcategory') || '';

  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    category: categoryId,
    subcategory: selectedSubcategory || undefined,
    brand: selectedBrand || undefined,
  });

  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  const category = (categories || []).find((c) => c._id === categoryId);
  const subcategories = (categories || []).filter(
    (c) => c.parentCategory && c.parentCategory.toString() === categoryId
  );

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

  const breadcrumbItems = [
    {
      label: category ? category.name : 'Category',
      to: `/category/${categoryId}`,
    },
  ];

  if (selectedSubcategory) {
    const subcat = subcategories.find((s) => s._id === selectedSubcategory);
    breadcrumbItems.push({ label: subcat ? subcat.name : 'Subcategory', to: null });
  }

  return (
    <>
      <Meta title={category ? `${category.name}` : 'Category'} />
      <BreadcrumbNav items={breadcrumbItems} />
      <h1>{category ? category.name : 'Category'}</h1>
      <p className='lead mb-4'>
        Browse trusted medical supplies tailored to this category.
      </p>
      <Row className='mb-3'>
        <Col md={4} className='mb-2'>
          <Form.Select
            value={selectedSubcategory}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
          >
            <option value=''>All Subcategories</option>
            {subcategories.map((subcat) => (
              <option key={subcat._id} value={subcat._id}>
                {subcat.name}
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

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : data.products.length === 0 ? (
        <Message variant='info'>
          No products found in this category. Please try another brand or
          subcategory.
        </Message>
      ) : (
        <>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword=''
            pageLinkPrefix={`/category/${categoryId}`}
            extraParams={searchParams.toString()}
          />
        </>
      )}
    </>
  );
};

export default CategoryScreen;
