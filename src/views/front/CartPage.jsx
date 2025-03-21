import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { updateCartData } from "../../store/cartSlice";
import { useForm } from "react-hook-form";
import MessageModal from "../../components/MessageModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  const [screenLoading, setScreenLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      couponCode: "",
    },
  });

  // 從 localStorage 獲取購物車資料
  const getLocalCart = () => {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : null;
  };

  // 更新 localStorage 中的購物車資料
  const updateLocalCart = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  // 從 localStorage 獲取優惠券資料
  const getLocalCoupon = () => {
    const localCoupon = localStorage.getItem("coupon");
    return localCoupon ? JSON.parse(localCoupon) : null;
  };

  // 更新 localStorage 中的優惠券資料
  const updateLocalCoupon = (couponData) => {
    if (couponData) {
      localStorage.setItem("coupon", JSON.stringify(couponData));
    } else {
      localStorage.removeItem("coupon");
    }
  };

  const showMessage = (message, type = "success") => {
    setMessageModal({
      isOpen: true,
      message,
      type,
    });
  };

  const closeMessage = () => {
    setMessageModal({
      isOpen: false,
      message: "",
      type: "success",
    });
  };

  const getCart = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));
      updateLocalCart(res.data.data);
    } catch (error) {
      console.error(error);
      showMessage("取得購物車失敗", "error");
    }
  }, [dispatch]);

  useEffect(() => {
    // 檢查 localStorage 是否有購物車資料
    const localCart = getLocalCart();
    if (localCart) {
      dispatch(updateCartData(localCart));
    }
    // 檢查 localStorage 是否有優惠券資料
    const localCoupon = getLocalCoupon();
    if (localCoupon) {
      setCouponCode(localCoupon.code);
    }
    // 無論是否有本地資料，都獲取最新的購物車資料
    getCart();
  }, [dispatch, getCart]);

  const removeCart = async () => {
    setScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/carts`);
      localStorage.removeItem("cart");
      getCart();
      showMessage("購物車已清空");
    } catch (error) {
      console.error(error);
      showMessage("刪除購物車失敗", "error");
    } finally {
      setScreenLoading(false);
    }
  };

  const removeCartItem = async (cartItem_id) => {
    setScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/cart/${cartItem_id}`);
      getCart();
      showMessage("商品已刪除");
    } catch (error) {
      console.error(error);
      showMessage("刪除購物車品項失敗", "error");
    } finally {
      setScreenLoading(false);
    }
  };

  const updataCartItem = async (cartItem_id, product_id, qty) => {
    setScreenLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/${API_PATH}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart();
    } catch (error) {
      console.error(error);
      showMessage("更新購物車品項失敗", "error");
    } finally {
      setScreenLoading(false);
    }
  };

  const applyCoupon = async (data) => {
    setIsCouponLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/${API_PATH}/coupon`, {
        data: { code: data.couponCode },
      });
      setCouponCode(data.couponCode);
      // 保存優惠券資訊到 localStorage
      updateLocalCoupon({ code: data.couponCode });
      getCart();
      showMessage(res.data.message);
    } catch (error) {
      console.error(error);
      showMessage(error.response?.data?.message || "套用優惠券失敗", "error");
    } finally {
      setIsCouponLoading(false);
    }
  };

  const removeCoupon = async () => {
    try {
      // 先重新獲取購物車資料
      const cartRes = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      const currentCart = cartRes.data.data;

      // 清空購物車
      await axios.delete(`${BASE_URL}/api/${API_PATH}/carts`);

      // 重新添加所有商品
      for (const item of currentCart.carts) {
        await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
          data: {
            product_id: item.product.id,
            qty: item.qty,
          },
        });
      }

      // 更新狀態
      await getCart();
      setCouponCode("");
      reset();
      updateLocalCoupon(null);
      showMessage("優惠券已移除");
    } catch (error) {
      console.error(error);
      showMessage("移除優惠券失敗", "error");
      // 發生錯誤時重新獲取購物車資料
      getCart();
    }
  };

  return (
    <div className="container-fluid">
      <div className="container  mb-5">
        <div className="mt-7">
          <h3 className="fw-bold h1 mb-3" style={{ color: "#e3e3e3" }}>
            菜單
          </h3>
          <div className="row">
            <div className="col-lg-8">
              {cart.carts?.length > 0 ? (
                <>
                  <div className="text-end py-3">
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => removeCart()}
                    >
                      清空購物車
                    </button>
                  </div>
                  <table className="table  text-center align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col" className="ps-0">
                          產品名稱
                        </th>
                        <th scope="col">數量</th>
                        <th scope="col">價格</th>
                        <th scope="col">刪除</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.carts?.map((cartItem) => (
                        <tr key={cartItem.id}>
                          {/* 產品名稱 */}
                          <td className="d-flex align-items-center justify-content-start py-3">
                            <img
                              src={cartItem.product.imageUrl}
                              alt={cartItem.product.title}
                              className="rounded"
                              style={{
                                width: "72px",
                                height: "72px",
                                objectFit: "cover",
                              }}
                            />
                            <p className="mb-0 fw-bold ms-3">
                              {cartItem.product.title}
                            </p>
                          </td>

                          {/* 數量 */}
                          <td style={{ maxWidth: "160px" }}>
                            <div className="input-group">
                              <button
                                className="btn btn-outline-dark border-0"
                                type="button"
                                onClick={() =>
                                  updataCartItem(
                                    cartItem.id,
                                    cartItem.product.id,
                                    cartItem.qty - 1
                                  )
                                }
                              >
                                <i className="bi bi-dash-lg"></i>
                              </button>

                              <input
                                type="text"
                                className="form-control text-center border-0 shadow-none"
                                value={cartItem.qty}
                                onChange={(e) =>
                                  updataCartItem(
                                    cartItem.id,
                                    cartItem.product.id,
                                    e.target.value
                                  )
                                }
                              />

                              <button
                                className="btn btn-outline-dark border-0"
                                type="button"
                                onClick={() =>
                                  updataCartItem(
                                    cartItem.id,
                                    cartItem.product.id,
                                    cartItem.qty + 1
                                  )
                                }
                              >
                                <i className="bi bi-plus-lg"></i>
                              </button>
                            </div>
                          </td>

                          {/* 價格 */}
                          <td>
                            <p className="mb-0">NT${cartItem.final_total}</p>
                          </td>

                          {/* 刪除按鈕 */}
                          <td>
                            <button
                              className="btn btn-outline-danger border-0"
                              type="button"
                              onClick={() => removeCartItem(cartItem.id)}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="input-group w-50 mb-3">
                    <input
                      aria-describedby="button-addon2"
                      aria-label="Recipient's username"
                      className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none"
                      placeholder="Coupon Code"
                      type="text"
                      {...register("couponCode", {
                        required: "請輸入優惠券代碼",
                      })}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-dark  border-top-0 border-start-0 border-end-0 rounded-0"
                        id="button-addon2"
                        type="button"
                        onClick={handleSubmit(applyCoupon)}
                        disabled={isCouponLoading}
                      >
                        {isCouponLoading ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <i className="fas fa-paper-plane" />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.couponCode && (
                    <div className="text-danger mb-2">
                      {errors.couponCode.message}
                    </div>
                  )}
                  {couponCode && (
                    <div className="alert alert-success d-flex justify-content-between align-items-center">
                      <span>已套用優惠券: {couponCode}</span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={removeCoupon}
                      >
                        移除優惠券
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <p className="mb-4" style={{ color: "#e3e3e3" }}>
                    請選擇商品後再下訂單
                  </p>
                  <Link to="/menu" className="btn btn-dark">
                    商品選單
                  </Link>
                </div>
              )}
            </div>
            <div className="col-lg-4">
              <div className="border p-4 mb-4 bg-light">
                <h4 className="fw-bold mb-4">訂單資訊</h4>
                {couponCode && (
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0">優惠券</p>
                    <div className="d-flex align-items-center">
                      <span className="me-2">{couponCode}</span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={removeCoupon}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-4">
                  <p className="mb-0 h4 fw-bold">總計</p>
                  <p className="mb-0 h4 fw-bold">NT${cart.final_total}</p>
                </div>
                {couponCode && cart.final_total !== cart.total && (
                  <div className="d-flex justify-content-between mt-2">
                    <p className="mb-0 text-decoration-line-through text-muted">
                      原價
                    </p>
                    <p className="mb-0 text-decoration-line-through text-muted">
                      NT${cart.total}
                    </p>
                  </div>
                )}
                <Link
                  to="/checkout-form"
                  className={`btn w-100 mt-4 ${
                    cart.final_total > 0 ? "btn-dark" : "btn-secondary disabled"
                  }`}
                >
                  送出
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={closeMessage}
        message={messageModal.message}
        type={messageModal.type}
      />
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
