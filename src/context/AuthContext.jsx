import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as loginApi, phoneLogin as phoneLoginApi, logout as logoutApi } from "../services/authApi";
import { useQueryClient } from "@tanstack/react-query";
import { syncCartOnLogin, fetchBackendCart } from '../features/cart/cartThunks';
import { clearCart } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartSyncing, setCartSyncing] = useState(false);  // new loading flag for cart
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const res = await getMe();
        setUser(res.data.data);

        setCartSyncing(true);
        // Wait for backend cart to fetch fully before letting UI load
        await dispatch(fetchBackendCart()).unwrap();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setCartSyncing(false);
      }
    };

    validateSession();
  }, [dispatch]);

  const login = async (credentials) => {
    await loginApi(credentials);
    const res = await getMe();
    setUser(res.data.data);

    setCartSyncing(true);
    // Wait for cart merge on login before UI updates cart display
    await dispatch(syncCartOnLogin()).unwrap();
    setCartSyncing(false);

    return res.data.data;
  };

  const phoneLogin = async (data) => {
    await phoneLoginApi(data);
    const res = await getMe();
    setUser(res.data.data);

    setCartSyncing(true);
    await dispatch(syncCartOnLogin()).unwrap();
    setCartSyncing(false);

    return res.data.data;
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem('authToken');
    dispatch(clearCart());
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, cartSyncing, login, phoneLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
