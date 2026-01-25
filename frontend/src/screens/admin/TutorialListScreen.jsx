import { useEffect, useState } from 'react';
import { Row, Col, Table, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  useGetTutorialsQuery,
  useCreateTutorialMutation,
  useUpdateTutorialMutation,
  useDeleteTutorialMutation,
} from '../../slices/tutorialsApiSlice';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch')) {
    const urlObj = new URL(url);
    const v = urlObj.searchParams.get('v');
    return v ? `https://www.youtube.com/embed/${v}?rel=0` : '';
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : '';
  }
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }
  return '';
};

const TutorialListScreen = () => {
  const { data: tutorials, isLoading, error, refetch } = useGetTutorialsQuery();
  const [createTutorial, { isLoading: creating }] = useCreateTutorialMutation();
  const [updateTutorial, { isLoading: updating }] = useUpdateTutorialMutation();
  const [deleteTutorial, { isLoading: deleting }] = useDeleteTutorialMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    setPreviewUrl(getEmbedUrl(videoUrl));
  }, [videoUrl]);

  useEffect(() => {
    if (!editingId) {
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setOrder(0);
      setIsActive(true);
      setPreviewUrl('');
    }
  }, [editingId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim(),
      order: order || 0,
      isActive,
    };
    if (!payload.title || !payload.videoUrl) {
      toast.error('Title and video link are required');
      return;
    }
    try {
      if (editingId) {
        await updateTutorial({ id: editingId, ...payload }).unwrap();
        toast.success('Tutorial updated');
      } else {
        await createTutorial(payload).unwrap();
        toast.success('Tutorial created');
      }
      setEditingId(null);
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setOrder(0);
      setIsActive(true);
      setPreviewUrl('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const startEdit = (tutorial) => {
    setEditingId(tutorial._id);
    setTitle(tutorial.title);
    setDescription(tutorial.description || '');
    setVideoUrl(tutorial.videoUrl);
    setOrder(tutorial.order || 0);
    setIsActive(!!tutorial.isActive);
    setPreviewUrl(getEmbedUrl(tutorial.videoUrl));
  };

  const confirmDelete = async () => {
    const id = pendingDelete;
    setPendingDelete(null);
    if (!id) return;
    try {
      await deleteTutorial(id).unwrap();
      toast.success('Tutorial deleted');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='admin-section'>
      <Row className='align-items-center mb-3'>
        <Col>
          <h1>Tutorials</h1>
        </Col>
      </Row>
      {(creating || updating || deleting) && <Loader />}
      <Row>
        <Col md={5}>
          <div className='card p-3 admin-form-card'>
            <h5>{editingId ? 'Edit Tutorial' : 'Add Tutorial'}</h5>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='title' className='my-2'>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Video title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId='description' className='my-2'>
                <Form.Label>Description (optional)</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='videoUrl' className='my-2'>
                <Form.Label>Video Link (YouTube or Facebook)</Form.Label>
                <Form.Control
                  type='url'
                  placeholder='https://...'
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
                <Form.Text className='text-muted'>
                  Paste a full YouTube or Facebook video URL.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId='order' className='my-2'>
                <Form.Label>Order (optional)</Form.Label>
                <Form.Control
                  type='number'
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group controlId='active' className='my-2'>
                <Form.Check
                  type='switch'
                  label='Active'
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              </Form.Group>
              {previewUrl && (
                <div className='ratio ratio-16x9 my-3'>
                  <iframe
                    src={previewUrl}
                    title='Preview'
                    allowFullScreen
                    loading='lazy'
                  ></iframe>
                </div>
              )}
              <Button type='submit' className='mt-3' disabled={creating || updating}>
                {editingId ? 'Update' : 'Create'}
              </Button>
              {editingId && (
                <Button
                  variant='light'
                  className='mt-3 ms-2'
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
              )}
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
                    <th>Title</th>
                    <th>Platform</th>
                    <th>Order</th>
                    <th>Active</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(tutorials || []).map((tutorial) => (
                    <tr key={tutorial._id}>
                      <td>{tutorial.title}</td>
                      <td className='text-capitalize'>{tutorial.platform}</td>
                      <td>{tutorial.order}</td>
                      <td>{tutorial.isActive ? 'Yes' : 'No'}</td>
                      <td className='text-end'>
                        <Button
                          variant='light'
                          size='sm'
                          className='mx-1'
                          onClick={() => startEdit(tutorial)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='danger'
                          size='sm'
                          className='mx-1'
                          onClick={() => setPendingDelete(tutorial._id)}
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
        message='Delete this tutorial?'
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default TutorialListScreen;
