import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BreadcrumbNav = ({ items }) => {
  return (
    <Breadcrumb className='mb-3'>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
        Home
      </Breadcrumb.Item>
      {items.map((item, idx) => (
        <Breadcrumb.Item
          key={idx}
          linkAs={Link}
          linkProps={item.to ? { to: item.to } : undefined}
          active={!item.to}
        >
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
