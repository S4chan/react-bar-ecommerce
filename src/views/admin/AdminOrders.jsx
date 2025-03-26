import OrderModal from "../../components/OrderModal";
import DelOrderModal from "../../components/DelOrderModal";
import Toast from "../../components/Toast";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { pushMessage } from "../../store/toastSlice";
import React from "react";
import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDelOrderModalOpen, setIsDelOrderModalOpen] = useState(false);
  const [tempOrder, setTempOrder] = useState(null);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [isQuickOpen, setIsQuickOpen] = useState(true);
  const [localReservations, setLocalReservations] = useState([]);
  const dispatch = useDispatch();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("hexToken");
      const response = await axios.get(
        `${BASE_URL}/api/${API_PATH}/admin/orders`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("獲取訂單失敗：", error);
      const { message } = error.response?.data || "獲取訂單失敗";
      dispatch(
        pushMessage({
          text: Array.isArray(message) ? message.join("、") : message,
          status: "failed",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchOrders();
    const reservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    setLocalReservations(reservations);
  }, [fetchOrders]);

  const openOrderModal = (order) => {
    setTempOrder(order);
    setIsOrderModalOpen(true);
  };

  const openDelOrderModal = (order = null, deleteAll = false) => {
    setTempOrder(order);
    setIsDeleteAll(deleteAll);
    setIsDelOrderModalOpen(true);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleDeleteReservation = (id) => {
    try {
      const updatedReservations = localReservations.filter(
        (reservation) => reservation.id !== id
      );
      localStorage.setItem("reservations", JSON.stringify(updatedReservations));
      setLocalReservations(updatedReservations);
      dispatch(
        pushMessage({
          id: Date.now(),
          status: "success",
          text: "訂位資料已刪除",
        })
      );
    } catch (error) {
      console.error("Delete reservation failed:", error);
      dispatch(
        pushMessage({
          id: Date.now(),
          status: "danger",
          text: "刪除訂位資料失敗",
        })
      );
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: "#e3e3e3" }}>訂單管理</h1>
          <button
            className="btn btn-danger"
            onClick={() => openDelOrderModal(null, true)}
          >
            刪除所有訂單
          </button>
        </div>

        {orders.length === 0 ? (
          <h3 className="mb-5 text-center" style={{ color: "#e3e3e3" }}>
            尚無訂單
          </h3>
        ) : (
          <>
            <div className="table-container">
              <div className="table-header">
                <h3 className="mb-3" style={{ color: "#e3e3e3" }}>
                  詳細訂單
                </h3>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsDetailOpen(!isDetailOpen)}
                >
                  {isDetailOpen ? "收起" : "展開"}
                </button>
              </div>
              <table className="table mt-2">
                <thead className="table-dark">
                  <tr>
                    <th>訂單編號</th>
                    <th>訂購時間</th>
                    <th>訂購人</th>
                    <th>訂購商品</th>
                    <th>總金額</th>
                    <th>訂單狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody
                  style={{ display: isDetailOpen ? "table-row-group" : "none" }}
                >
                  {orders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr>
                        <td>{order.id}</td>
                        <td>{new Date(order.create_at).toLocaleString()}</td>
                        <td>{order.user.name}</td>
                        <td>
                          {Object.values(order.products || {}).map(
                            (product) => (
                              <div key={product.id}>
                                {product.product.title} x {product.qty}
                              </div>
                            )
                          )}
                        </td>
                        <td>NT$ {order.total}</td>
                        <td>{order.is_paid ? "已付款" : "未付款"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => toggleOrderDetails(order.id)}
                          >
                            詳細
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => openOrderModal(order)}
                          >
                            編輯
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => openDelOrderModal(order)}
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                      {expandedOrderId === order.id && (
                        <tr>
                          <td colSpan="8">
                            <div className="card">
                              <div className="card-body">
                                <h6 className="card-title">訂單商品</h6>
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
                                    {Object.values(order.products).map(
                                      (product) => (
                                        <tr key={product.id}>
                                          <td>{product.product.title}</td>
                                          <td>{product.qty}</td>
                                          <td>{product.product.price}</td>
                                          <td>{product.total}</td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td colSpan="3" className="text-end">
                                        總計：
                                      </td>
                                      <td>{order.total}</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h3 className="mb-3" style={{ color: "#e3e3e3" }}>
                  快速訂單
                </h3>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsQuickOpen(!isQuickOpen)}
                >
                  {isQuickOpen ? "收起" : "展開"}
                </button>
              </div>
              <table className="table mt-2">
                <thead className="table-dark">
                  <tr>
                    <th>訂位時間</th>
                    <th>訂位人數</th>
                    <th>訂位日期</th>
                    <th>聯絡電話</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody
                  style={{ display: isQuickOpen ? "table-row-group" : "none" }}
                >
                  {localReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.time}</td>
                      <td>{reservation.people}</td>
                      <td>{reservation.date}</td>
                      <td>{reservation.tel}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDeleteReservation(reservation.id)
                          }
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          </>
        )}
      </div>

      <OrderModal
        tempOrder={tempOrder}
        isOpen={isOrderModalOpen}
        setIsOpen={setIsOrderModalOpen}
        fetchOrders={fetchOrders}
      />

      <DelOrderModal
        tempOrder={tempOrder}
        isOpen={isDelOrderModalOpen}
        setIsOpen={setIsDelOrderModalOpen}
        fetchOrders={fetchOrders}
        isDeleteAll={isDeleteAll}
      />

      <Toast />
    </>
  );
}
