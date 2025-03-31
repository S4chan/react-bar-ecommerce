import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";
import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CouponModal({
  tempCoupon,
  isOpen,
  setIsOpen,
  fetchCoupons,
  modalMode,
}) {
  const [couponData, setCouponData] = useState({
    title: "",
    code: "",
    percent: 0,
    due_date: "",
    is_enabled: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const couponModalRef = useRef(null);
  const modalInstance = useRef(null);
  const token = localStorage.getItem("hexToken");
  const dispatch = useDispatch();

  useEffect(() => {
    if (tempCoupon) {
      const date = tempCoupon.due_date
        ? new Date(tempCoupon.due_date * 1000)
        : new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setCouponData({
        title: tempCoupon.title || "",
        code: tempCoupon.code || "",
        percent: tempCoupon.percent || 0,
        due_date: formattedDate,
        is_enabled: tempCoupon.is_enabled || 1,
      });
    } else {
      setCouponData({
        title: "",
        code: "",
        percent: 0,
        due_date: "",
        is_enabled: 1,
      });
    }
  }, [tempCoupon]);

  useEffect(() => {
    if (isOpen && couponModalRef.current) {
      const modalElement = couponModalRef.current;

      if (modalInstance.current) {
        modalInstance.current.dispose();
        modalInstance.current = null;
      }

      modalInstance.current = new Modal(modalElement, {
        backdrop: "static",
        keyboard: false,
      });

      const handleHidden = () => {
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
        setIsOpen(false);
      };

      modalElement.addEventListener("hidden.bs.modal", handleHidden);
      modalInstance.current.show();

      return () => {
        modalElement.removeEventListener("hidden.bs.modal", handleHidden);
        if (modalInstance.current) {
          modalInstance.current.dispose();
          modalInstance.current = null;
        }
      };
    }
  }, [isOpen, setIsOpen]);

  const closeCouponModal = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const [year, month, day] = couponData.due_date.split("-");
      const dueDate = Math.floor(
        new Date(year, month - 1, day).getTime() / 1000
      );

      const submitData = {
        data: {
          title: couponData.title,
          code: couponData.code,
          percent: Number(couponData.percent),
          due_date: dueDate,
          is_enabled: Number(couponData.is_enabled),
        },
      };

      if (modalMode === "create") {
        await axios.post(
          `${BASE_URL}/api/${API_PATH}/admin/coupon`,
          submitData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else {
        await axios.put(
          `${BASE_URL}/api/${API_PATH}/admin/coupon/${tempCoupon.id}`,
          submitData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }

      dispatch(
        pushMessage({
          text: `優惠券${modalMode === "create" ? "新增" : "更新"}成功`,
          status: "success",
        })
      );
      await fetchCoupons();
      closeCouponModal();
    } catch (error) {
      console.error("提交優惠券失敗:", error);
      dispatch(
        pushMessage({
          text: error.response?.data?.message || "提交優惠券失敗",
          status: "danger",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      ref={couponModalRef}
      tabIndex="-1"
      aria-labelledby="couponModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="couponModalLabel">
              {modalMode === "create" ? "新增優惠券" : "編輯優惠券"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeCouponModal}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  優惠券名稱
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={couponData.title}
                  onChange={(e) =>
                    setCouponData({ ...couponData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="code" className="form-label">
                  優惠券代碼
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  value={couponData.code}
                  onChange={(e) =>
                    setCouponData({ ...couponData, code: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="percent" className="form-label">
                  折扣
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="percent"
                  value={couponData.percent}
                  onChange={(e) =>
                    setCouponData({ ...couponData, percent: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="due_date" className="form-label">
                  到期日
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="due_date"
                  value={couponData.due_date}
                  onChange={(e) =>
                    setCouponData({ ...couponData, due_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="is_enabled" className="form-label">
                  是否啟用
                </label>
                <select
                  className="form-select"
                  id="is_enabled"
                  value={couponData.is_enabled}
                  onChange={(e) =>
                    setCouponData({ ...couponData, is_enabled: e.target.value })
                  }
                >
                  <option value="1">啟用</option>
                  <option value="0">停用</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeCouponModal}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ReactLoading
                      type="spinningBubbles"
                      color="#ffffff"
                      height={20}
                      width={20}
                    />
                  ) : modalMode === "create" ? (
                    "新增"
                  ) : (
                    "更新"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

CouponModal.propTypes = {
  tempCoupon: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    code: PropTypes.string,
    percent: PropTypes.number,
    due_date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_enabled: PropTypes.number,
  }),
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  fetchCoupons: PropTypes.func,
  modalMode: PropTypes.oneOf(["create", "edit"]).isRequired,
};
