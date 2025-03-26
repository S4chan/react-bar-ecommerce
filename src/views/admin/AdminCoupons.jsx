import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { pushMessage } from "../../store/toastSlice";
import ReactLoading from "react-loading";

import CouponModal from "../../components/CouponModal";
import DelCouponModal from "../../components/DelCouponModal";
import Toast from "../../components/Toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDelCouponModalOpen, setIsDelCouponModalOpen] = useState(false);
  const [tempCoupon, setTempCoupon] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const dispatch = useDispatch();

  const fetchCoupons = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/${API_PATH}/admin/coupons`
      );
      const couponsArray = Object.values(response.data.coupons || {});
      setCoupons(couponsArray);
    } catch (error) {
      console.error("獲取優惠券失敗：", error);
      dispatch(
        pushMessage({
          id: Date.now(),
          status: "danger",
          text: error.response?.data?.message || "獲取優惠券失敗",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openCouponModal = (coupon = null) => {
    setTempCoupon(coupon);
    setModalMode(coupon ? "edit" : "create");
    setIsCouponModalOpen(true);
  };

  const openDelCouponModal = (coupon) => {
    setTempCoupon(coupon);
    setIsDelCouponModalOpen(true);
  };

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: "#e3e3e3" }}>優惠券管理</h1>
          <button className="btn btn-primary" onClick={() => openCouponModal()}>
            新增優惠券
          </button>
        </div>

        {coupons.length === 0 ? (
          <h3 className="mb-5 text-center" style={{ color: "#e3e3e3" }}>
            尚無優惠券
          </h3>
        ) : (
          <table className="table mt-2">
            <thead className="table-dark">
              <tr>
                <th>優惠券名稱</th>
                <th>優惠券代碼</th>
                <th>折扣</th>
                <th>到期日</th>
                <th>是否啟用</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.title}</td>
                  <td>{coupon.code}</td>
                  <td>{coupon.percent}%</td>
                  <td>
                    {new Date(coupon.due_date * 1000).toLocaleDateString(
                      "zh-TW"
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        coupon.is_enabled ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {coupon.is_enabled ? "啟用" : "停用"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openCouponModal(coupon)}
                    >
                      編輯
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => openDelCouponModal(coupon)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {loading && (
              <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
                style={{ zIndex: 9999 }}
              >
                <ReactLoading
                  type="spinningBubbles"
                  color="#6c757d"
                  height={100}
                  width={100}
                  className="position-fixed top-50 start-50 translate-middle"
                />
              </div>
            )}
          </table>
        )}
      </div>

      {isCouponModalOpen && (
        <CouponModal
          modalMode={modalMode}
          tempCoupon={tempCoupon}
          isOpen={isCouponModalOpen}
          setIsOpen={setIsCouponModalOpen}
          fetchCoupons={fetchCoupons}
        />
      )}

      <DelCouponModal
        tempCoupon={tempCoupon}
        isOpen={isDelCouponModalOpen}
        setIsOpen={setIsDelCouponModalOpen}
        fetchCoupons={fetchCoupons}
      />

      <Toast />
    </>
  );
}
