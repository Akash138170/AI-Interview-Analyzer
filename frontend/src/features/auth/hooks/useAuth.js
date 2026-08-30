import { useContext, useEffect } from "react";

import { AuthContext } from "../auth.context";
import { login, register, logOut, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
      const data = await login({
        email: email.trim(),
        password,
      });

      setUser(data.user);

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);

    try {
      const data = await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setUser(data.user);

      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        if (isMounted) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to get user:", error);

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getAndSetUser();

    return () => {
      isMounted = false;
    };
  }, [setUser, setLoading]);

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};