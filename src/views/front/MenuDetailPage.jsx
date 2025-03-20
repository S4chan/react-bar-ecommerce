import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import ReactLoading from "react-loading";
import { useDispatch } from "react-redux";
import { updateCartData } from "../../store/cartSlice";

import { pushMessage } from "../../store/toastSlice";
import Toast from "../../components/Toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function MenuDetailPage() {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const [randomProducts, setRandomProducts] = useState([]);
  const { id: product_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      setScreenLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/${API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        console.error(error);
        alert("取得產品失敗");
      } finally {
        setScreenLoading(false);
      }
    };
    getProduct();
  }, [product_id]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
        if (res.data && res.data.success) {
          const products = res.data.products;
          const shuffled = products
            .filter((p) => p.id !== product_id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 6);
          setRandomProducts(shuffled);
        }
      } catch (error) {
        console.error("取得推薦產品失敗:", error);
      }
    };
    getAllProducts();
  }, [product_id]);

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
    } catch (error) {
      console.error(error);
      alert("取得購物車失敗");
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const addCartItem = async (product_id, qty) => {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart();
      dispatch(
        pushMessage({
          id: Date.now(),
          status: "success",
          text: "已加入購物車",
        })
      );
    } catch (error) {
      console.error(error);
      alert("加入購物車失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid py-5">
        <div className="container py-4">
          <div className="row align-items-center bg-dark rounded-3 p-4 mb-5">
            <div className="col-md-7">
              <div
                className="bg-light rounded-3 overflow-hidden"
                style={{ aspectRatio: "1/1" }}
              >
                <img
                  src={product.imageUrl}
                  className="w-100 h-100"
                  alt={product.title}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
            <div className="col-md-5 mt-md-0 mt-4 text-white">
              <nav aria-label="breadcrumb">
                <ol
                  className="breadcrumb mb-0 py-3"
                  style={{ "--bs-breadcrumb-divider-color": "white" }}
                >
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white-50">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/menu" className="text-white-50">
                      Menu
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item active text-white"
                    aria-current="page"
                  >
                    餐點資訊
                  </li>
                </ol>
              </nav>

              <h2 className="fw-bold display-6 mb-3">{product.title}</h2>
              <div className="mb-4">
                <p className="mb-1 text-end text-white-50">
                  <del>NT${product.origin_price}</del>
                </p>
                <p className="h3 fw-bold text-end text-danger mb-0">
                  NT${product.price}
                </p>
              </div>

              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="input-group bg-light rounded">
                    <button
                      className="btn btn-outline-dark border-0 py-2"
                      type="button"
                      disabled={qtySelect === 1}
                      onClick={() => setQtySelect(qtySelect - 1)}
                    >
                      <i className="bi bi-dash-lg"></i>
                    </button>
                    <input
                      type="text"
                      className="form-control border-0 text-center shadow-none bg-light"
                      value={qtySelect}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-dark border-0 py-2"
                      type="button"
                      onClick={() => setQtySelect(qtySelect + 1)}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => addCartItem(product.id, qtySelect)}
                    disabled={isLoading}
                  >
                    <span>加入清單</span>
                    {isLoading && (
                      <ReactLoading
                        type="spin"
                        color="#fff"
                        height="1.5rem"
                        width="1.5rem"
                      />
                    )}
                  </button>
                </div>
                <div className="col-12">
                  <hr className="border-light opacity-25" />
                </div>
                <div className="col-12">
                  <h5 className="fw-bold mb-3">商品描述</h5>
                  <p className="mb-4 ">{product.description}</p>
                  <h5 className="fw-bold mb-3">商品內容</h5>
                  <p className="mb-0 ">{product.content}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 推薦商品列表 */}
          <div className="container-fluid py-4">
            <h3 className="fw-bold h4 mb-4" style={{ color: "#e3e3e3" }}>
              其他推薦品項
            </h3>
            <div className="row g-4">
              {randomProducts.map((product) => (
                <div className="col-lg-2 col-6" key={product.id}>
                  <div className="card h-100 border-0">
                    <div className="ratio ratio-1x1">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="card-img-top object-fit-cover"
                      />
                    </div>
                    <div className="card-body px-2 py-3">
                      <h6 className="card-title mb-2">{product.title}</h6>
                      <div className="d-flex flex-column gap-2">
                        <p className="text-danger fw-bold mb-0">
                          NT${product.price}
                        </p>
                        <Link
                          to={`/menu/${product.id}`}
                          className="btn btn-sm btn-outline-dark w-100"
                        >
                          查看詳情
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {screenLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-25"
          style={{ zIndex: 1060 }}
        >
          <ReactLoading type="spin" color="#000" width="4rem" height="4rem" />
        </div>
      )}
      <Toast />
    </>
  );
}
