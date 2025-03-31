import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { updateCartData } from "../../store/cartSlice";
import { useEffect } from "react";
import endImg from "../../assets/images/1hgu18al.webp";
import axios from "axios";
import { useCallback } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CheckoutSuccessPage() {
  const dispatch = useDispatch();

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
    <div className="container-fluid">
      <div
        className="position-relative d-flex mt-7"
        style={{ color: "#e3e3e3" }}
      >
        <div
          className="container d-flex flex-column"
          style={{ minHeight: "100vh" }}
        >
          <div className="row my-auto pb-7">
            <div className="col-md-4 d-flex flex-column">
              <div className="my-auto" style={{ lineHeight: "3" }}>
                <h2>預約成功</h2>
                <p className="mt-3">
                  感謝預約 <br />
                  期待您的到來
                </p>
                <Link to="/" className="btn btn-dark mt-4 px-5">
                  返回首頁
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-md-50 w-100 position-absolute opacity-1"
          style={{
            zIndex: -1,
            minHeight: "100vh",
            right: 0,
            backgroundImage: `url(${endImg})`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </div>
  );
}
