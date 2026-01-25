import { Nav, Image } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { logout } from '../../slices/authSlice';
import { resetCart } from '../../slices/cartSlice';
import logo from '../../assets/logo.png';

const links = [
  { to: '/', label: 'Back to Store' },
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/productlist', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/brands', label: 'Brands' },
  { to: '/admin/banners', label: 'Banners / Hero' },
  { to: '/admin/deals', label: "Today's Deals" },
  { to: '/admin/tutorials', label: 'Tutorials' },
  { to: '/admin/orderlist', label: 'Orders' },
  { to: '/admin/userlist', label: 'Customers' },
  { to: '/admin/inbox', label: 'Customer Queries' },
  { to: '/admin/settings', label: 'Settings' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className='admin-sidebar'>
      <div className='admin-brand d-flex align-items-center gap-2'>
        <Image src={logo} alt='Surgical Mart Nepal' height={32} />
        <div className='d-flex flex-column'>
          <span>Surgical Mart Nepal</span>
        </div>
      </div>
      <Nav className='flex-column'>
        {links.map((link) => (
          <Nav.Link
            key={link.to}
            as={Link}
            to={link.to}
            className={location.pathname.startsWith(link.to) ? 'active' : ''}
          >
            {link.label}
          </Nav.Link>
        ))}
        <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
