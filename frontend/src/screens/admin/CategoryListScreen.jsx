import { useEffect, useMemo, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '../../slices/categoriesApiSlice';

const CategoryListScreen = () => {
  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [editingId, setEditingId] = useState(null);

  const rootCategories = useMemo(
    () => (categories || []).filter((cat) => !cat.parentCategory),
    [categories]
  );

  useEffect(() => {
    if (!editingId) {
      setName('');
      setParentCategory('');
    }
  }, [editingId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      parentCategory: parentCategory ? parentCategory : null,
    };

    if (!payload.name) {
      toast.error('Name is required');
      return;
    }

    try {
      if (editingId) {
        await updateCategory({
          id: editingId,
          ...payload,
        }).unwrap();
        toast.success('Category updated');
      } else {
        await createCategory({
          ...payload,
        }).unwrap();
        toast.success('Category created');
      }
      setName('');
      setParentCategory('');
      setEditingId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setParentCategory(category.parentCategory || '');
  };

  return (
    <div className='admin-section'>
      <Row className='align-items-center mb-3'>
        <Col>
          <h1>Categories</h1>
        </Col>
        <Col className='text-end'>
          <Button as={Link} to='/admin/brands' className='btn-sm'>
            Manage Brands
          </Button>
        </Col>
      </Row>
      {(creating || updating) && <Loader />}
      <Row>
        <Col md={5}>
          <div className='card p-3 admin-form-card'>
            <h5>{editingId ? 'Edit Category' : 'Add Category'}</h5>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name' className='my-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter category name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId='parent' className='my-2'>
                <Form.Label>Parent Category (optional)</Form.Label>
                <Form.Select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                >
                  <option value=''>Root</option>
                  {rootCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button
                type='submit'
                className='mt-3'
                disabled={creating || updating}
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
                    <th>Name</th>
                    <th>Parent</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>
                        {
                          categories.find(
                            (cat) =>
                              cat._id ===
                              (category.parentCategory &&
                                category.parentCategory.toString())
                          )?.name
                        }
                      </td>
                      <td className='text-end'>
                        <Button
                          variant='light'
                          className='btn-sm mx-1'
                          onClick={() => startEdit(category)}
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

export default CategoryListScreen;
