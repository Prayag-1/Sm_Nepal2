import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return (
    <div className='admin-shell'>
      <AdminSidebar />
      <div className='admin-content'>
        <div className='admin-page-container'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
