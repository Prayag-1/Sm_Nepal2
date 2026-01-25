import { Table, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  useGetQueriesQuery,
  useMarkQueryReadMutation,
} from '../../slices/contactApiSlice';

const InboxScreen = () => {
  const { data: queries, isLoading, error, refetch } = useGetQueriesQuery();
  const [markRead, { isLoading: marking }] = useMarkQueryReadMutation();

  const markHandler = async (id) => {
    try {
      await markRead(id).unwrap();
      toast.success('Marked as read');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <h1>Customer Queries</h1>
      {marking && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>MESSAGE</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q) => (
              <tr key={q._id}>
                <td>{q.name}</td>
                <td>{q.email}</td>
                <td>{q.phone || '—'}</td>
                <td>{q.message}</td>
                <td>{q.createdAt && q.createdAt.substring(0, 10)}</td>
                <td>{q.isRead ? 'Read' : 'New'}</td>
                <td className='text-end'>
                  {!q.isRead && (
                    <Button size='sm' onClick={() => markHandler(q._id)}>
                      Mark Read
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default InboxScreen;
