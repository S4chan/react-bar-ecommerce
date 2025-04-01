import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function DelProductModal({
  isOpen,
  setIsOpen,
  tempProduct,
  catchProducts,
}) {
  const delProductModalRef = useRef(null);
  const token = localStorage.getItem("hexToken");
  const modalInstance = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && delProductModalRef.current) {
      const modalElement = delProductModalRef.current;

      if (modalInstance.current) {
        modalInstance.current.dispose();
        modalInstance.current = null;
      }

      modalInstance.current = new Modal(modalElement, {
        backdrop: "static",
        keyboard: false,
      });

      const handleHidden = () => {
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

  const closeDelProductModal = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(
        pushMessage({
          text: "產品刪除成功",
          status: "success",
        })
      );
      catchProducts();
      closeDelProductModal();
    } catch (error) {
      console.error("DelProductModal - deleteProduct - 刪除失敗:", error);
      dispatch(
        pushMessage({
          text: error.response?.data?.message || "產品刪除失敗",
          status: "failed",
        })
      );
    }
  };

  return (
    <div
      ref={delProductModalRef}
      className="modal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="delProductModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4" id="delProductModalLabel">
              刪除產品
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeDelProductModal}
            ></button>
          </div>

          <div className="modal-body p-4">
            <p className="mb-0">確定要刪除產品「{tempProduct.title}」嗎？</p>
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeDelProductModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteProduct}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DelProductModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  tempProduct: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
  }),
  catchProducts: PropTypes.func,
};
