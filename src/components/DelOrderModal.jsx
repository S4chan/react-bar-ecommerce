import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function DelOrderModal({
  tempOrder,
  isOpen,
  setIsOpen,
  fetchOrders,
  isDeleteAll = false,
}) {
  const delOrderModalRef = useRef(null);
  const token = localStorage.getItem("hexToken");
  const dispatch = useDispatch();

  useEffect(() => {
    new Modal(delOrderModalRef.current, { backdrop: false });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(delOrderModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  const closeDelOrderModal = () => {
    const modalInstance = Modal.getInstance(delOrderModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };

  const deleteOrder = async () => {
    try {
      if (isDeleteAll) {
        await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/orders/all`, {
          headers: {
            Authorization: token,
          },
        });
        dispatch(
          pushMessage({
            text: "所有訂單已刪除",
            status: "success",
          })
        );
      } else {
        await axios.delete(
          `${BASE_URL}/api/${API_PATH}/admin/order/${tempOrder.id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        dispatch(
          pushMessage({
            text: "訂單已刪除",
            status: "success",
          })
        );
      }
      fetchOrders();
      closeDelOrderModal();
    } catch (error) {
      const { message } = error.response?.data || "刪除失敗";
      dispatch(
        pushMessage({
          text: Array.isArray(message) ? message.join("、") : message,
          status: "failed",
        })
      );
    }
  };

  return (
    <div
      className="modal fade"
      id="delOrderModal"
      ref={delOrderModalRef}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="delOrderModalLabel"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="delOrderModalLabel">
              {isDeleteAll ? "刪除所有訂單" : "刪除訂單"}
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={closeDelOrderModal}
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <p>
              {isDeleteAll
                ? "確定要刪除所有訂單嗎？此操作無法復原。"
                : `確定要刪除訂單 ${tempOrder?.id} 嗎？此操作無法復原。`}
            </p>
          </div>

          <div className="modal-footer border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeDelOrderModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteOrder}
            >
              確定刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DelOrderModal.propTypes = {
  tempOrder: PropTypes.shape({
    id: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  fetchOrders: PropTypes.func,
  isDeleteAll: PropTypes.bool,
};
