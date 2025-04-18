import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";
import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function OrderModal({
  tempOrder,
  isOpen,
  setIsOpen,
  fetchOrders,
  setTempOrder,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const orderModalRef = useRef(null);
  const modalInstance = useRef(null);
  const token = localStorage.getItem("hexToken");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen && orderModalRef.current) {
      const modalElement = orderModalRef.current;

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
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("padding-right");
        document.body.removeAttribute("data-bs-overflow");
        document.body.removeAttribute("data-bs-padding-right");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
          backdrop.remove();
        }
      };

      modalElement.addEventListener("hidden.bs.modal", handleHidden);
      modalInstance.current.show();
    }

    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
        modalInstance.current = null;
      }
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
      document.body.removeAttribute("data-bs-overflow");
      document.body.removeAttribute("data-bs-padding-right");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    };
  }, [isOpen, setIsOpen]);

  // 處理 tempOrder 的更新
  useEffect(() => {
    if (tempOrder && modalInstance.current) {
      // 這裡可以處理 tempOrder 更新時的邏輯
      // 例如：更新表單欄位的值
    }
  }, [tempOrder]);

  const closeOrderModal = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
      // 清除 modal 相關的樣式
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
      document.body.removeAttribute("data-bs-overflow");
      document.body.removeAttribute("data-bs-padding-right");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    }
  };

  const handleInputBlur = (e) => {
    const { value, name } = e.target;
    // 創建一個新的物件來避免直接修改 tempOrder
    const updatedOrder = { ...tempOrder };

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      updatedOrder[parent] = {
        ...updatedOrder[parent],
        [child]: value,
      };
    } else {
      if (name === "is_paid") {
        updatedOrder[name] = value === "1";
      } else {
        updatedOrder[name] = value;
      }
    }

    // 更新父組件的 tempOrder
    setTempOrder(updatedOrder);
  };

  const updateOrder = async () => {
    if (!tempOrder) return;
    setIsLoading(true);
    try {
      const updateData = {
        data: {
          create_at: tempOrder.create_at,
          is_paid: tempOrder.is_paid,
          message: tempOrder.message,
          products: tempOrder.products,
          user: tempOrder.user,
          num: tempOrder.num,
        },
      };

      await axios.put(
        `${BASE_URL}/api/${API_PATH}/admin/order/${tempOrder.id}`,
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
      await fetchOrders();
      closeOrderModal();
    } catch (error) {
      console.error("更新訂單失敗:", error.response?.data);
      const errorMessage = error.response?.data?.message || "訂單更新失敗";
      dispatch(
        pushMessage({
          text: Array.isArray(errorMessage)
            ? errorMessage.join("、")
            : errorMessage,
          status: "failed",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!tempOrder) {
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
                    value={tempOrder.id || ""}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">訂單日期</label>
                  <input
                    type="text"
                    className="form-control"
                    value={new Date(
                      tempOrder.create_at * 1000
                    ).toLocaleString()}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">訂單狀態</label>
                  <select
                    name="is_paid"
                    className="form-select"
                    value={tempOrder.is_paid ? "1" : "0"}
                    onChange={handleInputBlur}
                  >
                    <option value="0">未付款</option>
                    <option value="1">已付款</option>
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
                    value={tempOrder.user?.name || ""}
                    onChange={handleInputBlur}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">電話</label>
                  <input
                    type="text"
                    name="user.tel"
                    className="form-control"
                    value={tempOrder.user?.tel || ""}
                    onChange={handleInputBlur}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    name="user.email"
                    className="form-control"
                    value={tempOrder.user?.email || ""}
                    onChange={handleInputBlur}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">地址</label>
                  <input
                    type="text"
                    name="user.address"
                    className="form-control"
                    value={tempOrder.user?.address || ""}
                    onChange={handleInputBlur}
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
                    {Object.values(tempOrder.products || {}).map((product) => (
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
                      <td>{tempOrder.total || 0}</td>
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
                    value={tempOrder.message || ""}
                    onChange={handleInputBlur}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <ReactLoading
                  type="spinningBubbles"
                  color="#ffffff"
                  height={20}
                  width={20}
                />
              ) : (
                "更新訂單"
              )}
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
    num: PropTypes.number,
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
  setTempOrder: PropTypes.func,
};
