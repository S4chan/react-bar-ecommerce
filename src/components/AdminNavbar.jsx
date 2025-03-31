import { useState } from "react";
import { Link, useNavigate } from "react-router";
import logoDark from "../assets/icons/logo-d.png";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const showSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className={"top-nav"}>
        <ul className={`top-ul sidebar ${isSidebarOpen ? "active" : ""}`}>
          <li
            onClick={(e) => {
              e.preventDefault();
              showSidebar();
            }}
          >
            <a href="#">
              <i className="bi bi-x"></i>
            </a>
          </li>
          <li>
            <Link to="/admin/home">後臺首頁</Link>
          </li>
          <li>
            <Link to="/admin/products">後臺產品列表</Link>
          </li>
          <li>
            <Link to="/admin/orders">訂單</Link>
          </li>
          <li>
            <Link to="/admin/coupons">優惠卷</Link>
          </li>
          <li className="logout">
            <a
              href="#"
              className="bg-danger text-white"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              登出
            </a>
          </li>
        </ul>
        <ul>
          <li className="logo">
            <a href="#">
              <img src={logoDark} alt="Dark-logo" />
            </a>
          </li>
          <li className="hideOnMobile">
            <Link to="/admin/home">後臺首頁</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/admin/products">後臺產品列表</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/admin/orders">訂單</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/admin/coupons">優惠卷</Link>
          </li>
          <li className="logout hideOnMobile">
            <a
              href="#"
              className="bg-danger text-white"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              登出
            </a>
          </li>
          <li className="menuButton">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showSidebar();
              }}
            >
              <i className="bi bi-list"></i>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
