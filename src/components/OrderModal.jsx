import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function OrderModal({
  tempOrder,
  isOpen,
  setIsOpen,
  fetchOrders,
}) {
  const orderModalRef = useRef(null);
  const modalInstance = useRef(null);
  const [modalData, setModalData] = useState(null);
  const token = localStorage.getItem("hexToken");
  const dispatch = useDispatch();

  useEffect(() => {
    if (tempOrder) {
      setModalData(tempOrder);
    }
  }, [tempOrder]);

  useEffect(() => {
    if (isOpen && orderModalRef.current && modalData) {
      const modalElement = orderModalRef.current;

      if (modalInstance.current) {
        modalInstance.current?.dispose();
        modalInstance.current = null;
      }

      modalInstance.current = new Modal(modalElement, {
        backdrop: "static",
        keyboard: false,
      });

      const handleHidden = () => {
        setIsOpen(false);
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      };

      modalElement.addEventListener("hidden.bs.modal", handleHidden);
      modalInstance.current.show();

      return () => {
        modalElement.removeEventListener("hidden.bs.modal", handleHidden);
        if (modalInstance.current) {
          modalInstance.current?.dispose();
          modalInstance.current = null;
        }
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      };
    }
  }, [isOpen, setIsOpen, modalData]);

  const closeOrderModal = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  };

  const handleInputBlur = (e) => {
    const { value, name } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setModalData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setModalData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const updateOrder = async () => {
    if (!modalData) return;

    try {
      const updateData = {
        data: {
          create_at: modalData.create_at,
          is_paid: modalData.is_paid,
          message: modalData.message,
          products: modalData.products,
          user: modalData.user,
          num: modalData.num,
        },
      };
      await axios.put(
        `${BASE_URL}/api/${API_PATH}/admin/order/${modalData.id}`,
        updateData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      dispatch(
        pushMessage({
          text: "訂單更新成功",
          status: "success",
        })
      );
      fetchOrders();
      closeOrderModal();
    } catch (error) {
      console.error("更新訂單失敗:", error.response?.data);
      console.error("錯誤詳情:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      const errorMessage = error.response?.data?.message || "訂單更新失敗";
      dispatch(
        pushMessage({
          text: Array.isArray(errorMessage)
            ? errorMessage.join("、")
            : errorMessage,
          status: "failed",
        })
      );
    }
  };

  if (!modalData) {
    return null;
  }

  return (
    <div
      id="orderModal"
      className="modal"
      ref={orderModalRef}
      tabIndex="-1"
      aria-labelledby="orderModalLabel"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4" id="orderModalLabel">
              訂單詳情
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeOrderModal}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="mb-3">訂單資訊</h6>
                <div className="mb-3">
                  <label className="form-label">訂單編號</label>
                  <input
                    type="text"
                    className="form-control"
                    value={modalData.id || ""}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">訂單日期</label>
                  <input
                    type="text"
                    className="form-control"
                    value={new Date(
                      modalData.create_at * 1000
                    ).toLocaleString()}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">訂單狀態</label>
                  <select
                    name="is_paid"
                    className="form-select"
                    defaultValue={modalData.is_paid ? 1 : 0}
                    onBlur={handleInputBlur}
                  >
                    <option value={0}>未付款</option>
                    <option value={1}>已付款</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <h6 className="mb-3">客戶資訊</h6>
                <div className="mb-3">
                  <label className="form-label">姓名</label>
                  <input
                    type="text"
                    name="user.name"
                    className="form-control"
                    defaultValue={modalData.user?.name || ""}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">電話</label>
                  <input
                    type="text"
                    name="user.tel"
                    className="form-control"
                    defaultValue={modalData.user?.tel || ""}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    name="user.email"
                    className="form-control"
                    defaultValue={modalData.user?.email || ""}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">地址</label>
                  <input
                    type="text"
                    name="user.address"
                    className="form-control"
                    defaultValue={modalData.user?.address || ""}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              <div className="col-12">
                <h6 className="mb-3">訂單商品</h6>
                <table className="table">
                  <thead>
                    <tr>
                      <th>商品名稱</th>
                      <th>數量</th>
                      <th>單價</th>
                      <th>小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(modalData.products || {}).map((product) => (
                      <tr key={product.id}>
                        <td>{product.product?.title || ""}</td>
                        <td>{product.qty || 0}</td>
                        <td>{product.product?.price || 0}</td>
                        <td>
                          {(product.product?.price || 0) * (product.qty || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end">
                        總計：
                      </td>
                      <td>{modalData.total || 0}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">備註</label>
                  <textarea
                    name="message"
                    className="form-control"
                    defaultValue={modalData.message || ""}
                    onBlur={handleInputBlur}
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeOrderModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={updateOrder}
            >
              更新訂單
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

OrderModal.propTypes = {
  tempOrder: PropTypes.shape({
    id: PropTypes.string,
    create_at: PropTypes.number,
    is_paid: PropTypes.bool,
    message: PropTypes.string,
    total: PropTypes.number,
    user: PropTypes.shape({
      name: PropTypes.string,
      tel: PropTypes.string,
      email: PropTypes.string,
      address: PropTypes.string,
    }),
    products: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          qty: PropTypes.number,
          product: PropTypes.shape({
            title: PropTypes.string,
            price: PropTypes.number,
          }),
        })
      ),
      PropTypes.object,
    ]),
  }),
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  fetchOrders: PropTypes.func,
};
