import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router";
import { updateCartData } from "../store/cartSlice";
import logoDark from "../assets/icons/logo-d.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Navbar() {
  const carts = useSelector((state) => state.cart.carts);

  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getCart = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
    } catch (error) {
      console.error(error);
      alert("取得購物車失敗");
    }
  }, [dispatch]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  return (
    <>
      <nav className={"top-nav fixed"}>
        <ul className={`top-ul sidebar ${isSidebarOpen ? "active" : ""}`}>
          <li onClick={showSidebar}>
            <a href="#">
              <i className="bi bi-x"></i>
            </a>
          </li>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/about">ABOUT</Link>
          </li>
          <li>
            <Link to="/menu">MENU</Link>
          </li>
          <li>
            <Link to="/event">活動</Link>
          </li>
          <li>
            <Link to="/cart">
              <div className="position-relative">
                <i className="fas fa-shopping-cart"></i>
                <span
                  className="position-absolute badge text-bg-success rounded-circle"
                  style={{
                    bottom: "12px",
                    left: "12px",
                  }}
                >
                  {carts?.length}
                </span>
              </div>
            </Link>
          </li>
        </ul>
        <ul>
          <li className="logo">
            <a href="#">
              <img src={logoDark} alt="w" />
            </a>
          </li>
          <li className="hideOnMobile">
            <Link to="/">HOME</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/about">ABOUT</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/menu">MENU</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/event">活動</Link>
          </li>
          <li className="hideOnMobile">
            <Link to="/cart">
              <div className="position-relative">
                <i className="fas fa-shopping-cart"></i>
                <span
                  className="position-absolute badge text-bg-success rounded-circle"
                  style={{
                    bottom: "12px",
                    left: "12px",
                  }}
                >
                  {carts?.length}
                </span>
              </div>
            </Link>
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
