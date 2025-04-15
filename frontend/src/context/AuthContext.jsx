import { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Verificar si hay un token guardado al cargar la aplicación
        const token = Cookies.get('jwt_token');
        if (token) {
            getUser(token);
        }
    }, []);

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ 
                    email: email,
                    password: password 
                }),
            });
            
            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Log para depuración
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }
            
            if (data.token) {
                Cookies.set('jwt_token', data.token, { expires: 7 }); // Expira en 7 días
                // Establecer el usuario con los datos que tenemos
                setUser({
                    email: email, // Usamos el email que ya tenemos
                    roles: data.roles || ['ROLE_USER'] // Usamos roles del servidor o un valor por defecto
                });
                return true; // Login exitoso
            } else {
                throw new Error('No se recibió el token de autenticación');
            }
        } catch (error) {
            console.error('Error completo:', error);
            setError(error.message || 'Error en el servidor');
            return false; // Login fallido
        } finally {
            setIsLoading(false);
        }
    }

    const getUser = async (token) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/user", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener información del usuario');
            }
            
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('Error al obtener información del usuario:', error);
            Cookies.remove('jwt_token');
            setUser(null);
        }
    }

    const register = async (email, password, username, fullName, phone, birthdate) => {
        try {
            setIsLoading(true);
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    email, 
                    password,
                    username,
                    fullName,
                    phone,
                    birthdate
                }),
            });
            const data = await response.json();
            if (response.ok) {
                // Después del registro exitoso, hacer login automáticamente
                await login(email, password);
            } else {
                setError(data.error || 'Error en el registro');
            }
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }

    const logout = async () => {
        Cookies.remove('jwt_token');
        setUser(null);
        setIsLoading(false);
        setError(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
