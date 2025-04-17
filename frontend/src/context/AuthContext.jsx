import { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
            getUser();
        }
    }, []);

    const getUser = async () => {
        try {
            const token = Cookies.get('jwt_token');
            console.log('Token being used:', token);
            
            if (!token) {
                console.log('No token found');
                setUser(null);
                return;
            }

            const response = await fetch("http://127.0.0.1:8000/api/user", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.trim()}`
                }
            });
            
            console.log('Full request details:', {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries([...response.headers.entries()]),
                requestHeaders: {
                    'Authorization': `Bearer ${token.trim()}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            
            const userData = await response.json();
            console.log('User data received:', userData);
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
            Cookies.remove('jwt_token');
            setUser(null);
        }
    };

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                credentials: 'include',
                mode: 'cors',
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }),
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }
            
            if (data.token) {
                console.log('Setting token:', data.token);
                Cookies.set('jwt_token', data.token.trim());
                
                // Add delay before getting user
                await new Promise(resolve => setTimeout(resolve, 100));
                await getUser();
                return true;
            } else {
                throw new Error('No se recibió el token de autenticación');
            }
        } catch (error) {
            console.error('Error completo:', error);
            setError(error.message || 'Error en el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email, password, username, fullName, phone, birthdate) => {
        try {
            setIsLoading(true);
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
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
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
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
