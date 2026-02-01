import { Navbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaEnvelope, FaPhoneAlt, FaBars } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import ConfirmDialog from './ConfirmDialog';
import { useState, useRef } from 'react';
import { useGetSettingsQuery } from '../slices/contactApiSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { data: settings } = useGetSettingsQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const { data: categories } = useGetCategoriesQuery();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const searchInputRef = useRef(null);

  const logoutHandler = async () => {
    setShowLogoutConfirm(false);
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className='mc-header'>
      <div className='top-utility-bar'>
        <Container fluid className='top-utility-inner'>
          <span>Nationwide delivery across Nepal</span>
          <span>Bulk orders & institutional supply</span>
          <Link to='/contact' className='top-utility-link'>
            Support / Contact
          </Link>
        </Container>
      </div>
      <div className='header-utility'>
        <Container fluid className='header-top-row'>
          <div className='d-flex align-items-center gap-3 brand-left'>
            <Link to='/' className='brand-identity text-decoration-none'>
              <div className='brand-mark'>
                <img src={logo} alt='Surgical Mart Nepal logo' className='brand-logo' />
              </div>
              <div className='brand-copy'>
                <span className='fw-semibold brand-text text-white'>Surgical Mart Nepal</span>
                <small className='brand-subtext'>
                  {settings?.tagline || 'Medical supply partners for Nepal'}
                </small>
              </div>
            </Link>
          </div>

          <div className='header-search-wrap'>
            <SearchBox inputRef={searchInputRef} />
          </div>

          <div className='d-flex align-items-center header-actions'>
            {userInfo ? (
              <NavDropdown
                title={<span className='header-profile-label'>{userInfo.name}</span>}
                id='username'
                align='end'
                menuVariant='dark'
              >
                <NavDropdown.Item as={Link} to='/profile'>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setShowLogoutConfirm(true)}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to='/login' className='header-profile'>
                <div className='profile-icon'>
                  <FaUser />
                </div>
                <div className='profile-text'>
                  <span className='profile-title'>Sign In</span>
                  <small>Login / Register</small>
                </div>
              </Nav.Link>
            )}

            <Nav.Link as={Link} to='/cart' className='header-cart'>
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <Badge pill bg='light' text='dark' className='ms-1'>
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </Badge>
              )}
            </Nav.Link>
          </div>
        </Container>
      </div>

      <Navbar
        bg='dark'
        variant='dark'
        expand='lg'
        collapseOnSelect
        className='subnav-bar sticky-nav mc-nav-bar'
      >
        <Container fluid className='subnav-inner'>
          <div className='d-flex align-items-center gap-2'>
            <FaBars className='text-light' />
            <Navbar.Toggle aria-controls='primary-nav' />
          </div>
          <Navbar.Collapse id='primary-nav'>
            <Nav className='subnav-links'>
              <NavDropdown title='Categories' id='categories-dropdown' menuVariant='dark' className='mc-nav-link'>
                {(categories || [])
                  .filter((cat) => !cat.parentCategory)
                  .map((cat) => (
                    <NavDropdown.Item as={Link} to={`/category/${cat._id}`} key={cat._id}>
                      {cat.name}
                    </NavDropdown.Item>
                  ))}
              </NavDropdown>
              <Nav.Link as={Link} to='/' className='mc-nav-link'>
                Products
              </Nav.Link>
              <Nav.Link as={Link} to='/brands' className='mc-nav-link'>
                Brands
              </Nav.Link>
              {userInfo?.isAdmin && (
                <Nav.Link as={Link} to='/admin/orderlist' className='mc-nav-link'>
                  Orders
                </Nav.Link>
              )}
              <Nav.Link as={Link} to='/about' className='mc-nav-link'>
                About
              </Nav.Link>
              <Nav.Link as={Link} to='/tutorials' className='mc-nav-link'>
                Resources
              </Nav.Link>
              <Nav.Link as={Link} to='/contact' className='mc-nav-link'>
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ConfirmDialog
        show={showLogoutConfirm}
        title='Confirm Logout'
        message='Are you sure you want to log out?'
        onConfirm={logoutHandler}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmVariant='danger'
      />
    </header>
  );
};

export default Header;
