import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const availableTimes = [
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
];

export default function CheckoutFormPage() {
  const [cart, setCart] = useState({ carts: [], final_total: 0 });
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const checkout = async (data) => {
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/order`, data);
      reset();
      navigate("/checkout-success");
    } catch (error) {
      console.error(error);
      alert("結帳失敗");
    }
  };

  const onSubmit = handleSubmit((data) => {
    const { message, people, date, time, creditCardNumber, ...user } = data;
    const combinedMessage = `
      人數：${people}
      用餐日期：${date}
      用餐時段：${time}
      付款方式：${
        paymentMethod === "creditCard"
          ? `信用卡支付 (卡號：${creditCardNumber})`
          : paymentMethod
      }
      備註：${message || "無"}
      
    `.trim();
    const userInfo = {
      data: {
        user,
        message: combinedMessage,
      },
    };
    checkout(userInfo);
  });

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.error(error);
      alert("取得購物車失敗");
    }
  };
  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="container mt-7">
      <div className="row justify-content-center">
        <div className="col-md-10" style={{ color: "#e3e3e3" }}>
          <h3 className="fw-bold mb-4 pt-3">結帳資訊</h3>
        </div>
      </div>
      <div className="row flex-row-reverse justify-content-center pb-5">
        <div className="col-lg-4">
          <div className="border p-4 mb-4 bg-light">
            {cart.carts?.map((cartItem) => (
              <div key={cartItem.id} className="d-flex mt-2">
                <img
                  src={cartItem.product.imageUrl}
                  alt={cartItem.product.title}
                  className="me-2"
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
                <div className="w-100">
                  <div className="d-flex justify-content-between">
                    <p className="mb-0 fw-bold">{cartItem.product.title}</p>
                    <p className="mb-0">NT${cartItem.final_total}</p>
                  </div>
                  <p className="mb-0 fw-bold">x{cartItem.qty}</p>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-between mt-4">
              <p className="mb-0 h4 fw-bold">Total</p>
              <p className="mb-0 h4 fw-bold">NT${cart.final_total}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <form onSubmit={onSubmit} className="container bg-light py-3">
            {/* 人數與日期 */}
            <div className="row mb-3">
              {/* 人數 */}
              <div className="col-md-6">
                <label htmlFor="people" className="form-label">
                  人數
                </label>
                <select
                  {...register("people", { required: "人數欄位必填" })}
                  id="people"
                  className={`form-select ${errors.people && "is-invalid"}`}
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i + 1} value={`${i + 2}位`}>
                      {i + 2} 位
                    </option>
                  ))}
                </select>
                {errors.people && (
                  <div className="text-danger">{errors.people.message}</div>
                )}
              </div>

              {/* 用餐日期 */}
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">
                  用餐日期
                </label>
                <input
                  {...register("date", { required: "用餐日期欄位必填" })}
                  id="date"
                  type="date"
                  className={`form-control ${errors.date && "is-invalid"}`}
                />
                {errors.date && (
                  <div className="text-danger">{errors.date.message}</div>
                )}
              </div>
            </div>

            {/* 用餐時段 */}
            <div className="mb-3">
              <label className="form-label">用餐時段</label>
              <div className="d-flex flex-wrap gap-2">
                {availableTimes.map((timeOption) => (
                  <div key={timeOption} className="form-check">
                    <input
                      {...register("time", { required: "請選擇用餐時段" })}
                      type="radio"
                      id={`time-${timeOption}`}
                      value={timeOption}
                      className="form-check-input"
                    />
                    <label
                      htmlFor={`time-${timeOption}`}
                      className="form-check-label"
                    >
                      {timeOption}
                    </label>
                  </div>
                ))}
              </div>
              {errors.time && (
                <div className="text-danger">{errors.time.message}</div>
              )}
            </div>

            {/* 付款方式 */}
            <div className="mb-3">
              <label className="form-label">付款方式</label>
              <div className="d-flex gap-3">
                {["cash", "applePay", "linePay", "creditCard"].map((method) => (
                  <div key={method} className="form-check">
                    <input
                      {...register("paymentMethod", {
                        required: "付款方式必選",
                        onChange: (e) => setPaymentMethod(e.target.value),
                      })}
                      type="radio"
                      id={method}
                      value={method}
                      className="form-check-input"
                    />
                    <label htmlFor={method} className="form-check-label">
                      {method === "cash" && "現金支付"}
                      {method === "applePay" && "ApplePay"}
                      {method === "linePay" && "Line Pay"}
                      {method === "creditCard" && "信用卡支付"}
                    </label>
                  </div>
                ))}
              </div>
              {errors.paymentMethod && (
                <div className="text-danger">
                  {errors.paymentMethod.message}
                </div>
              )}
            </div>

            {/* 信用卡卡號 */}
            {["applePay", "creditCard"].includes(paymentMethod) && (
              <div className="mb-3">
                <label htmlFor="creditCardNumber" className="form-label">
                  信用卡卡號
                </label>
                <input
                  {...register("creditCardNumber", {
                    required: "信用卡卡號必填",
                  })}
                  id="creditCardNumber"
                  type="text"
                  className={`form-control ${
                    errors.creditCardNumber && "is-invalid"
                  }`}
                  placeholder="請輸入信用卡卡號"
                />
                {errors.creditCardNumber && (
                  <div className="text-danger">
                    {errors.creditCardNumber.message}
                  </div>
                )}
              </div>
            )}

            {/* 個人資料 */}
            <div className="row g-3">
              {/* Email */}
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  {...register("email", {
                    required: "Email 欄位必填",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email 格式錯誤",
                    },
                  })}
                  id="email"
                  type="email"
                  className={`form-control ${errors.email && "is-invalid"}`}
                  placeholder="請輸入 Email"
                />
                {errors.email && (
                  <div className="text-danger">{errors.email.message}</div>
                )}
              </div>

              {/* Name */}
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">
                  姓名
                </label>
                <input
                  {...register("name", { required: "姓名欄位必填" })}
                  id="name"
                  type="text"
                  className={`form-control ${errors.name && "is-invalid"}`}
                  placeholder="請輸入姓名"
                />
                {errors.name && (
                  <div className="text-danger">{errors.name.message}</div>
                )}
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <label htmlFor="tel" className="form-label">
                  電話
                </label>
                <input
                  {...register("tel", {
                    required: "電話欄位必填",
                    pattern: {
                      value: /^(0[2-8]\d{7}|09\d{8})$/,
                      message: "電話格式錯誤",
                    },
                  })}
                  id="tel"
                  type="tel"
                  className={`form-control ${errors.tel && "is-invalid"}`}
                  placeholder="請輸入電話"
                />
                {errors.tel && (
                  <div className="text-danger">{errors.tel.message}</div>
                )}
              </div>

              {/* 地址 */}
              <div className="col-md-6">
                <label htmlFor="address" className="form-label">
                  收件人地址
                </label>
                <input
                  {...register("address", { required: "地址欄位必填" })}
                  id="address"
                  type="text"
                  className={`form-control ${errors.address && "is-invalid"}`}
                  placeholder="請輸入地址"
                />
                {errors.address && (
                  <div className="text-danger">{errors.address.message}</div>
                )}
              </div>
            </div>

            {/* 備註 */}
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                備註
              </label>
              <textarea
                {...register("message")}
                id="message"
                className="form-control"
                rows="5"
              ></textarea>
            </div>

            {/* 按鈕 */}
            <div className="d-flex justify-content-between mt-4">
              <Link to="/cart" className="btn btn-outline-secondary">
                <i className="bi bi-chevron-left me-2"></i> 上一步
              </Link>
              <button type="submit" className="btn btn-dark">
                下一步
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
