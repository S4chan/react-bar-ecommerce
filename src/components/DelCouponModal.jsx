import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function DelCouponModal({
  tempCoupon,
  isOpen,
  setIsOpen,
  fetchCoupons,
}) {
  const delCouponModalRef = useRef(null);
  const token = localStorage.getItem("hexToken");
  const dispatch = useDispatch();

  useEffect(() => {
    if (delCouponModalRef.current) {
      const modal = new Modal(delCouponModalRef.current, { backdrop: false });
      if (isOpen) {
        modal.show();
      } else {
        modal.hide();
      }
    }
  }, [isOpen]);

  const closeDelCouponModal = () => {
    if (delCouponModalRef.current) {
      const modalInstance = Modal.getInstance(delCouponModalRef.current);
      modalInstance?.hide();
      setIsOpen(false);
    }
  };

  const deleteCoupon = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/${API_PATH}/admin/coupon/${tempCoupon.id}`,
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
          text: "優惠券已刪除",
        })
      );

      closeDelCouponModal();
      fetchCoupons();
    } catch (error) {
      console.error("刪除優惠券失敗：", error);
      dispatch(
        pushMessage({
          id: Date.now(),
          status: "danger",
          text: error.response?.data?.message || "刪除優惠券失敗",
        })
      );
    }
  };

  return (
    <div
      className="modal fade"
      ref={delCouponModalRef}
      tabIndex="-1"
      aria-labelledby="delCouponModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="delCouponModalLabel">
              刪除優惠券
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeDelCouponModal}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              確定要刪除優惠券 &quot;{tempCoupon?.title}&quot;
              嗎？此操作無法復原。
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeDelCouponModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteCoupon}
            >
              確定刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DelCouponModal.propTypes = {
  tempCoupon: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  fetchCoupons: PropTypes.func,
};
