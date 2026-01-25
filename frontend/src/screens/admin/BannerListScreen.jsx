import { useState } from 'react';
import { Row, Col, Table, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
} from '../../slices/bannersApiSlice';
import { useUploadProductImageMutation } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import ConfirmDialog from '../../components/ConfirmDialog';

const BannerListScreen = () => {
  const { data: banners, isLoading, error, refetch } = useGetBannersQuery();
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [deleteBanner, { isLoading: deleting }] = useDeleteBannerMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProductImageMutation();

  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);
  const [uploadingMessage, setUploadingMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createBanner({ image, link, order: Number(order) || 0 }).unwrap();
      toast.success('Banner added');
      setImage('');
      setLink('');
      setOrder(0);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteHandler = async (id) => {
    setPendingDelete(id);
  };
  const confirmDelete = async () => {
    const id = pendingDelete;
    setPendingDelete(null);
    if (!id) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success('Banner removed');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='admin-section'>
      <h1 className='mb-4'>Hero Slider / Banners</h1>
      {(creating || deleting || uploading) && <Loader />}
      <Row>
        <Col md={5}>
          <div className='admin-form-card card p-3'>
            <h5 className='mb-3'>Add Banner</h5>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='image' className='my-2'>
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type='text'
                  value={image}
                  required
                  placeholder='https://...'
                  onChange={(e) => setImage(e.target.value)}
                />
                <Form.Control
                  type='file'
                  className='mt-2'
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('image', file);
                    try {
                      setUploadingMessage('Uploading...');
                      const res = await uploadImage(formData).unwrap();
                      setImage(res.image);
                      setUploadingMessage('Uploaded');
                    } catch (err) {
                      setUploadingMessage('');
                      toast.error(err?.data?.message || err.error);
                    }
                  }}
                />
                {uploadingMessage && <small>{uploadingMessage}</small>}
              </Form.Group>
              <Form.Group controlId='link' className='my-2'>
                <Form.Label>Link URL</Form.Label>
                <Form.Control
                  type='text'
                  value={link}
                  required
                  placeholder='/product/123 or https://...'
                  onChange={(e) => setLink(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='order' className='my-2'>
                <Form.Label>Order (optional)</Form.Label>
                <Form.Control
                  type='number'
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </Form.Group>
              <Button type='submit' className='mt-2'>
                Add Banner
              </Button>
            </Form>
          </div>
        </Col>
        <Col md={7}>
          <div className='card p-3'>
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
              <Table striped bordered hover responsive className='table-sm mb-0'>
                <thead>
                  <tr>
                    <th>IMAGE</th>
                    <th>LINK</th>
                    <th>ORDER</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner._id}>
                      <td>{banner.image}</td>
                      <td>{banner.link}</td>
                      <td>{banner.order}</td>
                      <td className='text-end'>
                        <Button
                          variant='danger'
                          size='sm'
                          onClick={() => deleteHandler(banner._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
      <ConfirmDialog
        show={!!pendingDelete}
        title='Confirm Delete'
        message='Delete this banner?'
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default BannerListScreen;
