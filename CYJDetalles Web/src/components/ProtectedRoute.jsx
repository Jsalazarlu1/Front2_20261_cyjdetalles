import { Navigate } from 'react-router-dom';
import { getCurrentUser, getAdminSession } from '../utils/storage';

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  const session = getAdminSession();
  
  if (!user && !session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
