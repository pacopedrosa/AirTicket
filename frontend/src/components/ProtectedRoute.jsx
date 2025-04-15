import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user } = useAuth();
  
  // Si el usuario no está autenticado, redirigir a la página de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario está autenticado, mostrar el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute; 