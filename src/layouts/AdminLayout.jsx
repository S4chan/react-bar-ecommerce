import { Outlet, useNavigate } from "react-router";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hexToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hexToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const checkToken = async () => {
      try {
        await axios.post(`${BASE_URL}/api/user/check`);
      } catch (error) {
        console.error("Token 驗證失敗", error);
        localStorage.removeItem("hexToken");
        localStorage.removeItem("hexTokenExpired");
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <AdminNavbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
