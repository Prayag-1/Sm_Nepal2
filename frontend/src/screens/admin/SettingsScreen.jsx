import { useEffect, useState } from 'react';
import { Tabs, Tab, Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../../slices/contactApiSlice';

const SettingsScreen = () => {
  const { data: settings, isLoading, error } = useGetSettingsQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();

  const [formState, setFormState] = useState({});

  useEffect(() => {
    if (settings) {
      setFormState(settings);
    }
  }, [settings]);

  const onChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(formState).unwrap();
      toast.success('Settings updated');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='admin-section'>
      <h1 className='mb-4'>Settings</h1>
      {saving && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Form onSubmit={submitHandler} className='card p-3 admin-form-card'>
          <Tabs defaultActiveKey='homepage' className='mb-3'>
            <Tab eventKey='homepage' title='Homepage'>
              <Row>
                <Col md={6}>
                  <Form.Group className='my-2' controlId='siteName'>
                    <Form.Label>Site Name</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.siteName || ''}
                      onChange={(e) => onChange('siteName', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='my-2' controlId='tagline'>
                    <Form.Label>Tagline</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.tagline || ''}
                      onChange={(e) => onChange('tagline', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='my-2' controlId='homepageNote'>
                    <Form.Label>Homepage Note</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={2}
                      value={formState.homepageNote || ''}
                      onChange={(e) => onChange('homepageNote', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey='seo' title='SEO'>
              <Row>
                <Col md={6}>
                  <Form.Group className='my-2' controlId='seoTitle'>
                    <Form.Label>Default SEO Title</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.seoTitle || ''}
                      onChange={(e) => onChange('seoTitle', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='my-2' controlId='seoDescription'>
                    <Form.Label>Default SEO Description</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={2}
                      value={formState.seoDescription || ''}
                      onChange={(e) => onChange('seoDescription', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey='social' title='Social Media'>
              <Row>
                <Col md={6}>
                  <Form.Group className='my-2' controlId='socialFacebook'>
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.socialFacebook || ''}
                      onChange={(e) => onChange('socialFacebook', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='my-2' controlId='socialInstagram'>
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.socialInstagram || ''}
                      onChange={(e) =>
                        onChange('socialInstagram', e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className='my-2' controlId='socialWhatsApp'>
                    <Form.Label>WhatsApp</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.socialWhatsApp || ''}
                      onChange={(e) => onChange('socialWhatsApp', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey='contact' title='Contact'>
              <Row>
                <Col md={6}>
                  <Form.Group className='my-2' controlId='contactPhone'>
                    <Form.Label>Contact Phone</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.contactPhone || ''}
                      onChange={(e) => onChange('contactPhone', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='my-2' controlId='contactEmail'>
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control
                      type='email'
                      value={formState.contactEmail || ''}
                      onChange={(e) => onChange('contactEmail', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='my-2' controlId='address'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.address || ''}
                      onChange={(e) => onChange('address', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className='my-2' controlId='footerText'>
                    <Form.Label>Footer Text</Form.Label>
                    <Form.Control
                      type='text'
                      value={formState.footerText || ''}
                      onChange={(e) => onChange('footerText', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>
          </Tabs>
          <Button type='submit' className='mt-3'>
            Save Settings
          </Button>
        </Form>
      )}
    </div>
  );
};

export default SettingsScreen;
