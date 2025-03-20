import { useState } from "react";
import { Link } from "react-router";
import logoDark from "../assets/icons/logo-d.png";

export default function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className={"top-nav"}>
        <ul className={`top-ul sidebar ${isSidebarOpen ? "active" : ""}`}>
          <li onClick={showSidebar}>
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
        </ul>
        <ul>
          <li className="logo">
            <a href="#">
              <img src={logoDark} alt="w" />
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
          <li className="menuButton" onClick={() => showSidebar()}>
            <a href="#">
              <i className="bi bi-list"></i>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
