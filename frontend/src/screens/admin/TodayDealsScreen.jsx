import { useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetFeaturedProductsQuery,
  useGetProductsQuery,
  useUpdateProductFeaturedMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const TodayDealsScreen = () => {
  const [keyword, setKeyword] = useState('');
  const {
    data: products,
    isLoading,
    error,
    refetch: refetchFeatured,
  } = useGetFeaturedProductsQuery();
  const {
    data: productList,
    isLoading: loadingAll,
    error: listError,
    refetch: refetchProducts,
  } = useGetProductsQuery({ keyword, pageNumber: 1 });
  const [updateFeatured, { isLoading: updating }] = useUpdateProductFeaturedMutation();

  const toggleFeatured = async (product, isFeatured) => {
    try {
      const payload = {
        productId: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        brand: product.brand?._id || product.brand,
        category: product.category?._id || product.category,
        subcategory: product.subcategory?._id || product.subcategory || null,
        countInStock: product.countInStock,
        isFeatured,
      };
      await updateFeatured(payload).unwrap();
      await refetchFeatured();
      refetchProducts();
      toast.success(isFeatured ? 'Added to today’s deals' : 'Removed from deals');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Update failed');
    }
  };

  return (
    <div className='admin-section'>
      <Row className='align-items-center mb-3'>
        <Col>
          <h1>Today&apos;s Deals</h1>
        </Col>
      </Row>

      <div className='card p-3 admin-card mb-4'>
        <h5 className='mb-3'>Current deals</h5>
        {isLoading || updating ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm mb-0'>
            <thead>
              <tr>
                <th>NAME</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.countInStock}</td>
                  <td className='text-end'>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      size='sm'
                      variant='light'
                      className='me-2'
                    >
                      Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='outline-danger'
                      onClick={() => toggleFeatured(product, false)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <div className='card p-3 admin-card'>
        <h5 className='mb-3'>Add products to deals</h5>
        <Form className='mb-3' onSubmit={(e) => e.preventDefault()}>
          <Row className='g-2'>
            <Col md={6}>
              <Form.Control
                type='text'
                placeholder='Search products by name'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </Col>
          </Row>
        </Form>
        {loadingAll ? (
          <Loader />
        ) : listError ? (
          <Message variant='danger'>
            {listError?.data?.message || listError.error}
          </Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm mb-0'>
            <thead>
              <tr>
                <th>NAME</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(productList?.products || []).map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.countInStock}</td>
                  <td className='text-end'>
                    <Button
                      size='sm'
                      variant='outline-success'
                      onClick={() => toggleFeatured(product, true)}
                    >
                      Add to Deals
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TodayDealsScreen;
