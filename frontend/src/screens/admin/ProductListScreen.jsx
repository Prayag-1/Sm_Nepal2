import { Table, Button, Row, Col, Badge } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingCreate, setPendingCreate] = useState(false);

  const deleteHandler = async (id) => {
    setPendingDelete(id);
  };

  const createProductHandler = async () => {
    setPendingCreate(true);
  };

  const confirmCreate = async () => {
    setPendingCreate(false);
    try {
      await createProduct();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const confirmDelete = async () => {
    const id = pendingDelete;
    setPendingDelete(null);
    if (!id) return;
    try {
      await deleteProduct(id);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {(loadingCreate || loadingDelete) && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>STOCK</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>
                    {typeof product.category === 'object'
                      ? product.category?.name
                      : product.category}
                  </td>
                  <td>
                    {typeof product.brand === 'object'
                      ? product.brand?.name
                      : product.brand}
                  </td>
                  <td>
                    <Badge bg={product.countInStock > 0 ? 'success' : 'secondary'}>
                      {product.countInStock > 0 ? 'In Stock' : 'Out'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
      <ConfirmDialog
        show={pendingCreate}
        title='Create Product'
        message='Create a new product using defaults?'
        onConfirm={confirmCreate}
        onCancel={() => setPendingCreate(false)}
        confirmVariant='primary'
      />
      <ConfirmDialog
        show={!!pendingDelete}
        title='Confirm Delete'
        message='Are you sure you want to delete this product?'
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
};

export default ProductListScreen;
