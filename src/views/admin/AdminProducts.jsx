import ProductModal from "../../components/ProductModal";
import DelProductModal from "../../components/DelProductModal";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast.jsx";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

export default function AdminProducts() {
  const [pageInfo, setPageInfo] = useState({});
  const [products, setProducts] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const catchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("hexToken");
      const products = await axios.get(
        `${BASE_URL}/api/${API_PATH}/admin/products?page=${page}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setProducts(products.data.products);
      setPageInfo(products.data.pagination);
    } catch (error) {
      console.error("取得產品列表失敗：", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    catchProducts();
  }, []);

  const openDelProductModal = (product) => {
    setTempProduct(product);

    setIsDelProductModalOpen(true);
  };

  const [tempProduct, setTempProduct] = useState(defaultModalState);

  const pageChangeHandler = (page) => {
    catchProducts(page);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("hexToken");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      await axios.post(`${BASE_URL}/logout`, {}, config);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };

  const openProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case "create":
        setTempProduct(defaultModalState);
        break;
      case "edit":
        setTempProduct(product);
        break;
      default:
        break;
    }

    setIsProductModalOpen(true);
  };

  return (
    <>
      <div className="container py-5">
        <div className="row mb-3">
          <div className="justify-content-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleLogout()}
            >
              登出
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h1 style={{ color: "#e3e3e3" }}>產品列表</h1>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openProductModal("create")}
              >
                建立新的產品
              </button>
            </div>
            <table className="table mt-3">
              <thead className="table-dark">
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openProductModal("edit", product)}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => openDelProductModal(product)}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination pageInfo={pageInfo} pageChangeHandler={pageChangeHandler} />
        <Toast />
      </div>

      <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        catchProducts={catchProducts}
      />

      <DelProductModal
        tempProduct={tempProduct}
        catchProducts={catchProducts}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
      />

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
  );
}
