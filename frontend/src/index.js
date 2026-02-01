import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './screens/admin/AdminDashboard';
import TodayDealsScreen from './screens/admin/TodayDealsScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import CategoryListScreen from './screens/admin/CategoryListScreen';
import BrandListScreen from './screens/admin/BrandListScreen';
import CategoryScreen from './screens/CategoryScreen';
import BrandScreen from './screens/BrandScreen';
import BrandsListScreen from './screens/BrandsListScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import BannerListScreen from './screens/admin/BannerListScreen';
import InboxScreen from './screens/admin/InboxScreen';
import SettingsScreen from './screens/admin/SettingsScreen';
import TutorialsScreen from './screens/TutorialsScreen';
import TutorialListScreen from './screens/admin/TutorialListScreen';
import store from './store';
import { Provider } from 'react-redux';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<App />}>
        <Route index={true} path='/' element={<HomeScreen />} />
        <Route path='/search/:keyword' element={<HomeScreen />} />
        <Route path='/page/:pageNumber' element={<HomeScreen />} />
        <Route
          path='/search/:keyword/page/:pageNumber'
          element={<HomeScreen />}
        />
        <Route path='/category/:categoryId' element={<CategoryScreen />} />
        <Route
          path='/category/:categoryId/page/:pageNumber'
          element={<CategoryScreen />}
        />
        <Route path='/product/:id' element={<ProductScreen />} />
        <Route path='/cart' element={<CartScreen />} />
        <Route path='/about' element={<AboutScreen />} />
        <Route path='/contact' element={<ContactScreen />} />
        <Route path='/brand/:brandId' element={<BrandScreen />} />
        <Route path='/brands' element={<BrandsListScreen />} />
        <Route path='/tutorials' element={<TutorialsScreen />} />
        <Route path='/login' element={<LoginScreen />} />
        <Route path='/register' element={<RegisterScreen />} />
        {/* Registered users */}
        <Route path='' element={<PrivateRoute />}>
          <Route path='/shipping' element={<ShippingScreen />} />
          <Route path='/payment' element={<PaymentScreen />} />
          <Route path='/placeorder' element={<PlaceOrderScreen />} />
          <Route path='/order/:id' element={<OrderScreen />} />
          <Route path='/profile' element={<ProfileScreen />} />
        </Route>
      </Route>

      <Route path='/admin' element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to='dashboard' replace />} />
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='orderlist' element={<OrderListScreen />} />
          <Route path='productlist' element={<ProductListScreen />} />
          <Route path='productlist/:pageNumber' element={<ProductListScreen />} />
          <Route path='userlist' element={<UserListScreen />} />
          <Route path='product/:id/edit' element={<ProductEditScreen />} />
          <Route path='user/:id/edit' element={<UserEditScreen />} />
          <Route path='categories' element={<CategoryListScreen />} />
          <Route path='brands' element={<BrandListScreen />} />
          <Route path='banners' element={<BannerListScreen />} />
          <Route path='deals' element={<TodayDealsScreen />} />
          <Route path='tutorials' element={<TutorialListScreen />} />
          <Route path='inbox' element={<InboxScreen />} />
          <Route path='settings' element={<SettingsScreen />} />
        </Route>
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
