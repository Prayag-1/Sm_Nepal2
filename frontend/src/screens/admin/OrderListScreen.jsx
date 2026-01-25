import { Table, Button, Form } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!orders) return [];
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((o) => {
      const userName = o.user?.name?.toLowerCase() || '';
      return (
        o._id.toLowerCase().includes(term) ||
        userName.includes(term) ||
        (o.user?.email || '').toLowerCase().includes(term)
      );
    });
  }, [orders, search]);

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Form className='mb-3 d-flex align-items-center gap-2'>
            <Form.Control
              type='text'
              placeholder='Search by order ID, user, or email'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant='outline-secondary' onClick={() => setSearch('')}>
              Clear
            </Button>
          </Form>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PHONE</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>{order.shippingAddress?.phone || 'N/A'}</td>
                  <td>
                    <Badge bg={order.isPaid ? 'success' : 'warning'} text={order.isPaid ? undefined : 'dark'}>
                      {order.isPaid ? 'Paid' : 'COD Pending'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={order.isDelivered ? 'success' : 'secondary'}>
                      {order.isDelivered ? 'Delivered' : 'In Transit'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      variant='light'
                      className='btn-sm'
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default OrderListScreen;
