import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import Meta from '../components/Meta';

const AboutScreen = () => {
  return (
    <>
      <Meta title='About Us | Surgical Mart Nepal' />
      <Row className='mb-4'>
        <Col>
          <h1>About Surgical Mart Nepal</h1>
          <p className='lead'>
            We are a Nepal-based medical supply partner dedicated to bringing
            clinician-grade products to hospitals, clinics, and caregivers with
            transparent pricing and dependable delivery.
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={7}>
          <Card className='info-card mb-3'>
            <Card.Body>
              <Card.Title>Our Mission</Card.Title>
              <Card.Text>
                To equip Nepal&apos;s healthcare providers with reliable surgical
                and diagnostic supplies, ensuring every patient encounter is safe
                and dignified.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className='info-card'>
            <Card.Body>
              <Card.Title>Why Clinicians Trust Us</Card.Title>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  Curated brands vetted for hospitals and surgical centers.
                </ListGroup.Item>
                <ListGroup.Item>
                  Cold-chain aware logistics partners across Nepal.
                </ListGroup.Item>
                <ListGroup.Item>
                  Transparent inventory status and COD-friendly checkout.
                </ListGroup.Item>
                <ListGroup.Item>
                  Local support with rapid response for urgent needs.
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className='info-card'>
            <Card.Body>
              <Card.Title>Service Footprint</Card.Title>
              <Card.Text>
                Based in Nepal, serving Kathmandu Valley and nationwide partners
                through trusted courier networks.
              </Card.Text>
              <ListGroup>
                <ListGroup.Item>Hospitals &amp; surgical centers</ListGroup.Item>
                <ListGroup.Item>Clinics &amp; diagnostics</ListGroup.Item>
                <ListGroup.Item>Home care &amp; rehab support</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AboutScreen;
