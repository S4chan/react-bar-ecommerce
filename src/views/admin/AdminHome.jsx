import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { useDispatch } from "react-redux";
import { pushMessage } from "../../store/toastSlice";
import Toast from "../../components/Toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminHome() {
  const [statistics, setStatistics] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("hexToken");

        const productsResponse = await axios.get(
          `${BASE_URL}/api/${API_PATH}/admin/products/all`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const ordersResponse = await axios.get(
          `${BASE_URL}/api/${API_PATH}/admin/orders`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const localReservations = JSON.parse(
          localStorage.getItem("reservations") || "[]"
        );

        const productsCount = Object.keys(
          productsResponse.data.products
        ).length;
        const detailOrdersCount = ordersResponse.data.orders.length;
        const quickOrdersCount = localReservations.length;
        const totalRevenue = ordersResponse.data.orders.reduce(
          (sum, order) => sum + order.total,
          0
        );

        setStatistics({
          productsCount,
          ordersCount: detailOrdersCount + quickOrdersCount,
          totalRevenue,
        });
      } catch (error) {
        console.error("獲取統計數據失敗：", error);
        dispatch(
          pushMessage({
            id: Date.now(),
            status: "danger",
            text: "獲取統計數據失敗",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [dispatch]);

  return (
    <>
      <div className="container my-5">
        <h1 className="mb-4" style={{ color: "#e3e3e3" }}>
          後台管理
        </h1>

        <div className="card bg-dark text-white mb-5">
          <div className="card-header">
            <h3 className="mb-0">統計資訊</h3>
          </div>
          <div className="card-body">
            <table className="table table-dark">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>數值</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>產品總數</td>
                  <td>{statistics.productsCount} 個</td>
                </tr>
                <tr>
                  <td>訂單總數</td>
                  <td>{statistics.ordersCount} 筆</td>
                </tr>
                <tr>
                  <td>訂單總金額</td>
                  <td>NT$ {statistics.totalRevenue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
      <Toast />
    </>
  );
}
