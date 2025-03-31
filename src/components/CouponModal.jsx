import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";

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
    try {
      const [year, month, day] = couponData.due_date.split("-");
      const selectedDate = new Date(Date.UTC(year, month - 1, day, 15, 59, 59));
      const timestamp = Math.floor(selectedDate.getTime() / 1000);

      const submitData = {
        data: {
          title: couponData.title,
          is_enabled: couponData.is_enabled,
          percent: Number(couponData.percent),
          due_date: timestamp,
          code: couponData.code,
        },
      };

      if (modalMode === "edit" && tempCoupon?.id) {
        await axios.put(
          `${BASE_URL}/api/${API_PATH}/admin/coupon/${tempCoupon.id}`,
          submitData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch(
          pushMessage({
            id: Date.now(),
            status: "success",
            text: "優惠券已更新",
          })
        );
      } else {
        await axios.post(
          `${BASE_URL}/api/${API_PATH}/admin/coupon`,
          submitData,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch(
          pushMessage({
            id: Date.now(),
            status: "success",
            text: "優惠券已新增",
          })
        );
      }

      closeCouponModal();
      fetchCoupons();
    } catch (error) {
      let errorMessage = "優惠券操作失敗";
      if (error.response?.data?.message) {
        if (typeof error.response.data.message === "object") {
          errorMessage = Object.values(error.response.data.message).join(", ");
        } else {
          errorMessage = error.response.data.message;
        }
      }

      dispatch(
        pushMessage({
          id: Date.now(),
          status: "danger",
          text: errorMessage,
        })
      );
    }
  };

  return (
    <div
      className="modal"
      id="couponModal"
      ref={couponModalRef}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="couponModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="couponModalLabel">
              {modalMode === "create" ? "新增優惠券" : "編輯優惠券"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeCouponModal}
              aria-label="Close"
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
                  優惠碼
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
                  折扣百分比
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="percent"
                  value={couponData.percent}
                  onChange={(e) =>
                    setCouponData({ ...couponData, percent: e.target.value })
                  }
                  min="1"
                  max="100"
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
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="is_enabled"
                    checked={couponData.is_enabled === 1}
                    onChange={(e) =>
                      setCouponData({
                        ...couponData,
                        is_enabled: e.target.checked ? 1 : 0,
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="is_enabled">
                    啟用
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeCouponModal}
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === "edit" ? "更新" : "新增"}
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
