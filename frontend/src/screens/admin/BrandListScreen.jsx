import { useEffect, useState } from 'react';
import { Row, Col, Table, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useCreateBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
} from '../../slices/brandsApiSlice';
import { useUploadProductImageMutation } from '../../slices/productsApiSlice';

const BrandListScreen = () => {
  const { data: brands, isLoading, error, refetch } = useGetBrandsQuery();
  const [createBrand, { isLoading: creating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProductImageMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  useEffect(() => {
    if (!editingId) {
      setName('');
      setDescription('');
      setImage('');
      setPreview('');
    }
  }, [editingId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
    };
    if (description.trim()) payload.description = description.trim();
    if (image && image.trim()) payload.image = image.trim();
    if (seoTitle.trim()) payload.seoTitle = seoTitle.trim();
    if (seoDescription.trim()) payload.seoDescription = seoDescription.trim();
    if (seoKeywords.trim()) payload.seoKeywords = seoKeywords.split(',').map((k) => k.trim()).filter(Boolean);

    if (!payload.name) {
      toast.error('Name is required');
      return;
    }

    try {
      if (editingId) {
        await updateBrand({ id: editingId, ...payload }).unwrap();
        toast.success('Brand updated');
      } else {
        await createBrand(payload).unwrap();
        toast.success('Brand created');
      }
      setName('');
      setDescription('');
      setImage('');
      setPreview('');
      setSeoTitle('');
      setSeoDescription('');
      setSeoKeywords('');
      setEditingId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const startEdit = (brand) => {
    setEditingId(brand._id);
    setName(brand.name);
    setDescription(brand.description || '');
    setImage(brand.image || '');
    setPreview(brand.image || '');
    setSeoTitle(brand.seoTitle || '');
    setSeoDescription(brand.seoDescription || '');
    setSeoKeywords(
      Array.isArray(brand.seoKeywords) ? brand.seoKeywords.join(', ') : brand.seoKeywords || ''
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadImage(formData).unwrap();
      setImage(res.image);
      setPreview(res.image);
      toast.success(res.message || 'Image uploaded');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='admin-section'>
      <Row className='align-items-center mb-3'>
        <Col>
          <h1>Brands</h1>
        </Col>
        <Col className='text-end'>
          <Button as={Link} to='/admin/categories' className='btn-sm'>
            Manage Categories
          </Button>
        </Col>
      </Row>
      {(creating || updating || uploading) && <Loader />}
      <Row>
        <Col md={5}>
          <div className='card p-3 admin-form-card'>
            <h5>{editingId ? 'Edit Brand' : 'Add Brand'}</h5>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name' className='my-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter brand name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId='description' className='my-2'>
                <Form.Label>Description (optional)</Form.Label>
                <Form.Control
                  as='textarea'
                  placeholder='Short description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='image' className='my-2'>
                <Form.Label>Brand Image (optional)</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Image URL'
                  value={image || ''}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setPreview(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group controlId='imageFile' className='my-2'>
                <Form.Control type='file' label='Choose File' onChange={uploadFileHandler} />
              </Form.Group>
              {preview && (
                <div className='mb-2'>
                  <Image src={preview} alt='Brand preview' fluid rounded />
                </div>
              )}
              <hr />
              <h6 className='mt-3'>SEO Settings (optional)</h6>
              <Form.Group controlId='seoTitle' className='my-2'>
                <Form.Label>Meta Title</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='SEO title'
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='seoDescription' className='my-2'>
                <Form.Label>Meta Description</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={2}
                  placeholder='Short SEO description'
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='seoKeywords' className='my-2'>
                <Form.Label>Meta Keywords</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='keyword1, keyword2'
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                />
              </Form.Group>
              <Button
                type='submit'
                className='mt-3'
                disabled={creating || updating || uploading}
              >
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
              <Message variant='danger'>
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <Table striped bordered hover responsive className='table-sm mb-0'>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand._id}>
                      <td>
                        {brand.image ? (
                          <Image src={brand.image} alt={brand.name} height={36} rounded />
                        ) : (
                          <span className='text-muted small'>—</span>
                        )}
                      </td>
                      <td>{brand.name}</td>
                      <td>{brand.description}</td>
                      <td className='text-end'>
                        <Button
                          variant='light'
                          className='btn-sm mx-1'
                          onClick={() => startEdit(brand)}
                        >
                          Edit
                        </Button>
                        <span className='text-muted small'>Delete disabled (in use)</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BrandListScreen;
