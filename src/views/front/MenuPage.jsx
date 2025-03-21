import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import axios from "axios";
import ReactLoading from "react-loading";
import Pagination from "../../components/Pagination";
import { updateCartData } from "../../store/cartSlice";
import { useDispatch } from "react-redux";
import mainImage from "../../assets/images/2c1qr805.png";
import logoW from "../../assets/icons/logo-w.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const accordionStyles = {
  category: {
    marginBottom: "1rem",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  header: {
    padding: "1rem",
    backgroundColor: "white",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    padding: "0.5rem",
    backgroundColor: "#413930",
  },
  button: {
    border: "none",
    padding: "0.5rem 0",
    display: "block",
    color: "#e3e3e3",
    background: "none",
    textAlign: "left",
    width: "100%",
    transition: "color 0.2s ease-in-out",
    "&:hover": {
      color: "#000",
    },
  },
  icon: {
    transition: "transform 0.3s ease",
  },
  iconRotate: {
    transform: "rotate(180deg)",
  },
};

export default function MenuPage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [selectesCategory, setSelectesCategory] = useState("全部");
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleCollapse = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [wishList, setWishList] = useState(() => {
    const initWishList = localStorage.getItem("wishList")
      ? JSON.parse(localStorage.getItem("wishList"))
      : {};
    return initWishList;
  });

  const toggleWishListItem = (product_id) => {
    const newWishList = {
      ...wishList,
      [product_id]: !wishList[product_id],
    };

    localStorage.setItem("wishList", JSON.stringify(newWishList));

    setWishList(newWishList);
  };

  const getAllProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
      if (res.data && res.data.success) {
        setAllProducts(res.data.products);
      }
    } catch (error) {
      console.error("取得所有產品失敗:", error);
    }
  }, []);

  const getCart = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
    } catch (error) {
      console.error(error);
      alert("取得購物車失敗");
    }
  }, [dispatch]);

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
    } catch (error) {
      console.error(error);
      alert("加入購物車失敗");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCart();
    getAllProducts();
  }, [getCart, getAllProducts]);

  const getProducts = useCallback(
    async (page = 1) => {
      setScreenLoading(true);
      try {
        if (selectesCategory === "收藏") {
          const wishListProducts = allProducts.filter((p) => wishList[p.id]);
          setProducts(wishListProducts);
          setPageInfo({});
        } else {
          const categoryQuery =
            selectesCategory === "全部" ? "" : `&category=${selectesCategory}`;

          const res = await axios.get(
            `${BASE_URL}/api/${API_PATH}/products?page=${page}${categoryQuery}`
          );

          if (res.data && res.data.success) {
            setProducts(res.data.products);
            setPageInfo(res.data.pagination || {});
          } else {
            console.error("API 回傳資料格式錯誤", res.data);
            alert("API 資料格式錯誤");
          }
        }
      } catch (error) {
        console.error("取得產品失敗:", error);
        alert("取得產品失敗");
      } finally {
        setScreenLoading(false);
      }
    },
    [selectesCategory, wishList, allProducts]
  );

  const categories = [
    "全部",
    "收藏",
    ...new Set(allProducts.map((product) => product.category)),
  ];

  useEffect(() => {
    getProducts(1);
  }, [getProducts]);

  const pageChangeHandler = (page) => {
    getProducts(page);
  };

  return (
    <div className="container-fluid p-0">
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          minHeight: "400px",
          backgroundImage: `url(${mainImage})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        <img
          src={logoW}
          alt=""
          style={{ width: "200px", height: "auto", display: "block" }}
        />
      </div>
      <div className="container mt-md-5 mt-3 mb-7">
        <div className="row">
          <div className="col-md-3">
            <div style={accordionStyles.category}>
              <div style={accordionStyles.card}>
                <div
                  style={accordionStyles.header}
                  onClick={() => toggleCollapse(0)}
                >
                  <div style={accordionStyles.title}>
                    <h4 className="mb-0">分類</h4>
                    <i
                      className="fas fa-chevron-down"
                      style={{
                        ...accordionStyles.icon,
                        ...(activeIndex === 0 && accordionStyles.iconRotate),
                      }}
                    ></i>
                  </div>
                </div>
                <div
                  style={{
                    ...accordionStyles.body,
                    display: activeIndex === 0 ? "block" : "none",
                  }}
                >
                  <ul className="list-unstyled m-0">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          type="button"
                          style={accordionStyles.button}
                          onClick={() => setSelectesCategory(category)}
                          onMouseOver={(e) => (e.target.style.color = "#000")}
                          onMouseOut={(e) => (e.target.style.color = "#e3e3e3")}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="row g-4">
              {products.map((product) => (
                <div className="col-lg-6" key={product.id}>
                  <div className="card border-0 mb-4 h-100">
                    <div className="row g-0 h-100">
                      <div className="col-5 pe-0">
                        <div className="ratio ratio-1x1">
                          <img
                            src={product.imageUrl}
                            className="img-fluid w-100 h-100 object-fit-cover"
                            alt={product.title}
                          />
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="card-body h-100 d-flex flex-column py-3">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <h4
                              className="mb-0"
                              style={{
                                fontSize: "1.1rem",
                                lineHeight: "1.4",
                                height: "3.2rem",
                                display: "-webkit-box",
                                WebkitLineClamp: "2",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {product.title}
                            </h4>
                            <button
                              type="button"
                              className="btn btn-link p-0 border-0 flex-shrink-0"
                              onClick={() => toggleWishListItem(product.id)}
                            >
                              <i
                                className={`bi ${
                                  wishList[product.id]
                                    ? "bi-bookmark-fill"
                                    : "bi-bookmark"
                                }`}
                                style={{ fontSize: "1.25rem" }}
                              ></i>
                            </button>
                          </div>

                          <div className="d-flex flex-column gap-2 mt-auto">
                            <p className="card-text mb-0">
                              <span className="fs-5 fw-bold text-danger">
                                NT${product.price}
                              </span>
                              <span className="text-muted ms-2">
                                <del>NT${product.origin_price}</del>
                              </span>
                            </p>
                            <Link
                              to={`/menu/${product.id}`}
                              className="btn btn-outline-dark btn-sm w-100"
                            >
                              詳細資訊
                            </Link>
                            <button
                              type="button"
                              onClick={() => addCartItem(product.id, 1)}
                              className="btn btn-danger w-100"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  <span>處理中</span>
                                  <ReactLoading
                                    type="spin"
                                    color="#fff"
                                    height="1.5rem"
                                    width="1.5rem"
                                  />
                                </div>
                              ) : (
                                "加到清單"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {pageInfo.total_pages > 1 && (
              <nav className="d-flex justify-content-center mt-4">
                <Pagination
                  pageInfo={{
                    current_page: pageInfo.current_page,
                    total_pages: pageInfo.total_pages,
                    has_pre: pageInfo.current_page > 1,
                    has_next: pageInfo.current_page < pageInfo.total_pages,
                  }}
                  pageChangeHandler={pageChangeHandler}
                />
              </nav>
            )}
          </div>
        </div>
      </div>
      {screenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </div>
  );
}
