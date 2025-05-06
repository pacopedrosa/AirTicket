import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    // Mostrar un spinner simple mientras se verifica la autenticación
    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
        );
    }

    // Si el usuario no está autenticado, redirigir al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si el usuario está autenticado, mostrar el contenido protegido
    return <Outlet />;
};

export default ProtectedRoute;