import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const cards = [
  { title: 'Orders', link: '/admin/orderlist', desc: 'Manage orders' },
  { title: 'Products', link: '/admin/productlist', desc: 'Manage products' },
  { title: "Today’s Deals", link: '/admin/deals', desc: 'Feature products' },
  { title: 'Banners', link: '/admin/banners', desc: 'Hero slider' },
  { title: 'Inbox', link: '/admin/inbox', desc: 'Customer queries' },
  { title: 'Settings', link: '/admin/settings', desc: 'Site settings' },
];

const AdminDashboard = () => {
  return (
    <>
      <h1 className='mb-4'>Dashboard</h1>
      <Row>
        {cards.map((card) => (
          <Col key={card.link} md={4} className='mb-3'>
            <Card className='admin-card'>
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.desc}</Card.Text>
                <Link to={card.link}>Open</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default AdminDashboard;
