import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Meta from '../components/Meta';
import { useSubmitContactMutation, useGetSettingsQuery } from '../slices/contactApiSlice';
import { toast } from 'react-toastify';

const ContactScreen = () => {
  const [submitContact, { isLoading }] = useSubmitContactMutation();
  const { data: settings } = useGetSettingsQuery();

  const submitHandler = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      message: form.get('message'),
    };
    try {
      await submitContact(payload).unwrap();
      toast.success('Message sent. We will respond soon.');
      e.target.reset();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not send message');
    }
  };

  return (
    <>
      <Meta title='Contact Us | Surgical Mart Nepal' />
      <Row className='mb-4'>
        <Col>
          <h1>Contact Us</h1>
          <p className='lead'>
            Have a procurement request or need product guidance? Our 
            support team is ready to help.
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className='info-card mb-3'>
            <Card.Body>
              <Card.Title>Support Channels</Card.Title>
              <p className='mb-1'>
                <strong>Email:</strong> {settings?.contactEmail || 'surgicalmartnepal@gmail.com'}
              </p>
              <p className='mb-1'>
                <strong>Phone:</strong> {settings?.contactPhone || '+977 985-1169537'}
              </p>
              <p>
                <strong>Address:</strong> {settings?.address || 'Kathmandu, Nepal'}
              </p>
            </Card.Body>
          </Card>
          <Card className='info-card'>
            <Card.Body>
              <Card.Title>Logistics & Delivery</Card.Title>
              <Card.Text>
                We coordinate with trusted courier partners for cold-chain aware
                medical deliveries. COD available nationwide.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className='info-card'>
            <Card.Body>
              <Card.Title>Quick Message</Card.Title>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='mb-3'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control name='name' type='text' placeholder='Your name' required />
                </Form.Group>
                <Form.Group controlId='email' className='mb-3'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name='email'
                    type='email'
                    placeholder='you@example.com'
                    required
                  />
                </Form.Group>
                <Form.Group controlId='phone' className='mb-3'>
                  <Form.Label>Phone (optional)</Form.Label>
                  <Form.Control name='phone' type='text' placeholder='Contact number' />
                </Form.Group>
                <Form.Group controlId='message' className='mb-3'>
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    name='message'
                    as='textarea'
                    rows={4}
                    placeholder='How can we help?'
                    required
                  />
                </Form.Group>
                <Button type='submit' disabled={isLoading}>
                  Send
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ContactScreen;
