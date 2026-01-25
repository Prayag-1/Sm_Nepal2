import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice';
import { useGetBrandsQuery } from '../../slices/brandsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        subcategory: subcategory || null,
        description,
        countInStock,
        isFeatured,
        seoTitle,
        seoDescription,
        seoKeywords,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand?._id || product.brand);
      setCategory(product.category?._id || product.category);
      setSubcategory(product.subcategory?._id || '');
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setIsFeatured(!!product.isFeatured);
      setSeoTitle(product.seoTitle || '');
      setSeoDescription(product.seoDescription || '');
      setSeoKeywords(
        Array.isArray(product.seoKeywords) ? product.seoKeywords.join(', ') : product.seoKeywords || ''
      );
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1 className='mb-4'>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              >
                <option value=''>Select brand</option>
                {(brands || []).map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory('');
                }}
                required
              >
                <option value=''>Select category</option>
                {(categories || [])
                  .filter((cat) => !cat.parentCategory)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='subcategory'>
              <Form.Label>Subcategory (optional)</Form.Label>
              <Form.Select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              >
                <option value=''>None</option>
                {(categories || [])
                  .filter(
                    (cat) =>
                      cat.parentCategory &&
                      cat.parentCategory.toString() === category?.toString()
                  )
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <hr />
            <h5 className='mt-3'>SEO Settings</h5>
            <Form.Text className='text-muted mb-2 d-block'>
              Optional: helps search engines with better titles and descriptions.
            </Form.Text>
            <Form.Group controlId='seoTitle'>
              <Form.Label>Meta Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Optional SEO title'
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='seoDescription'>
              <Form.Label>Meta Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Optional ~160 characters'
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='seoKeywords'>
              <Form.Label>Meta Keywords</Form.Label>
              <Form.Control
                type='text'
                placeholder='Comma separated keywords'
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='isFeatured' className='mt-3'>
              <Form.Check
                type='checkbox'
                label="Mark as Today's Deal"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
