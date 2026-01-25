import { Navbar, Nav, Container, NavDropdown, Badge, Form, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaGlobe, FaSearch } from 'react-icons/fa';
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

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

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
      <div className='header-utility'>
        <Container className='d-flex justify-content-end align-items-center utility-inner'>
          <Form.Select size='sm' className='utility-lang' aria-label='Language selector'>
            <option>EN</option>
          </Form.Select>
          <Button
            variant='link'
            className='utility-icon'
            onClick={() => searchInputRef.current?.focus()}
            aria-label='Search'
          >
            <FaSearch />
          </Button>
          {userInfo ? (
            <Button
              variant='link'
              className='utility-icon'
              onClick={() => setShowLogoutConfirm(true)}
              aria-label='Account'
            >
              <FaUser />
            </Button>
          ) : (
            <Nav.Link as={Link} to='/login' className='utility-icon'>
              <FaUser />
            </Nav.Link>
          )}
        </Container>
      </div>

      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect className='elevated-nav sticky-nav'>
        <Container className='justify-content-between'>
          <Navbar.Brand
            as={Link}
            to='/'
            className='d-flex align-items-center gap-3 brand-left nav-brand-compact'
          >
            <img src={logo} alt='Surgical Mart Nepal logo' className='brand-logo' />
            <span className='fw-semibold text-white'>Surgical Mart Nepal</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='primary-nav' />
          <Navbar.Collapse id='primary-nav'>
            <Nav className='mx-auto primary-nav'>
              <Nav.Link as={Link} to='/'>
                Products
              </Nav.Link>
              <NavDropdown title='Categories' id='categories-dropdown' menuVariant='light'>
                {(categories || [])
                  .filter((cat) => !cat.parentCategory)
                  .map((cat) => (
                    <NavDropdown.Item as={Link} to={`/category/${cat._id}`} key={cat._id}>
                      {cat.name}
                    </NavDropdown.Item>
                  ))}
              </NavDropdown>
              <Nav.Link as={Link} to='/?view=brands'>
                Brands
              </Nav.Link>
              {userInfo?.isAdmin && (
                <Nav.Link as={Link} to='/admin/orderlist'>
                  Orders
                </Nav.Link>
              )}
              <Nav.Link as={Link} to='/about'>
                About
              </Nav.Link>
              <Nav.Link as={Link} to='/tutorials'>
                Resources
              </Nav.Link>
              <NavDropdown title='More' id='more-menu' menuVariant='light'>
                <NavDropdown.Item as={Link} to='/contact'>
                  Contact
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/cart'>
                  Cart
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className='align-items-center gap-3'>
              <SearchBox inputRef={searchInputRef} />
              <Nav.Link as={Link} to='/cart' className='nav-cart'>
                <FaShoppingCart />
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <NavDropdown.Item as={Link} to='/profile'>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => setShowLogoutConfirm(true)}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/login'>
                  <FaUser /> Sign In
                </Nav.Link>
              )}
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
