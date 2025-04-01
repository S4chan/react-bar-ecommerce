import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { pushMessage } from "../store/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductModal({
  modalMode,
  tempProduct,
  isOpen,
  setIsOpen,
  catchProducts,
}) {
  const productModalRef = useRef(null);
  const [modalData, setModalData] = useState(tempProduct);
  const token = localStorage.getItem("hexToken");
  const modalInstance = useRef(null);

  useEffect(() => {
    setModalData({
      ...tempProduct,
    });
  }, [tempProduct]);

  useEffect(() => {
    if (isOpen && productModalRef.current) {
      const modalElement = productModalRef.current;

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

  const dispatch = useDispatch();

  const closeProductModal = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
    }
  };

  const modalInputChangehandler = (e) => {
    const { value, name, checked, type } = e.target;

    setModalData({
      ...modalData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const imageChangehandler = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl];

    newImages[index] = value;

    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  const addImageHandler = () => {
    const newImages = [...modalData.imagesUrl, ""];

    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  const removeImageHandler = () => {
    const newImages = [...modalData.imagesUrl];

    newImages.pop();

    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  const createProduct = async () => {
    await axios.post(
      `${BASE_URL}/api/${API_PATH}/admin/product`,
      {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    dispatch(
      pushMessage({
        text: "產品新增成功",
        status: "success",
      })
    );
  };

  const updataProduct = async () => {
    // 檢查必填欄位
    const requiredFields = [
      "title",
      "category",
      "unit",
      "origin_price",
      "price",
    ];
    const emptyFields = requiredFields.filter((field) => !modalData[field]);

    if (emptyFields.length > 0) {
      throw new Error(`以下欄位不能為空：${emptyFields.join("、")}`);
    }

    await axios.put(
      `${BASE_URL}/api/${API_PATH}/admin/product/${modalData.id}`,
      {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    dispatch(
      pushMessage({
        text: "產品編輯成功",
        status: "success",
      })
    );
  };

  const updataProductHandler = async () => {
    const apiCall = modalMode === "create" ? createProduct : updataProduct;

    try {
      await apiCall();
      catchProducts();
      closeProductModal();
    } catch (error) {
      console.error("ProductModal - updataProductHandler - 操作失敗:", error);
      dispatch(
        pushMessage({
          text: error.response?.data?.message || "產品更新失敗",
          status: "failed",
        })
      );
      // 清空圖片上傳欄位
      const imageInput = document.querySelector('input[type="file"]');
      if (imageInput) {
        imageInput.value = "";
      }
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/${API_PATH}/admin/upload`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const uploadedImageUrl = res.data.imageUrl;

      setModalData({
        ...modalData,
        imageUrl: uploadedImageUrl,
      });
    } catch (error) {
      alert("圖片上傳失敗");
      console.error(error);
    }
  };

  return (
    <div
      ref={productModalRef}
      className="modal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="productModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4" id="productModalLabel">
              {modalMode === "create" ? "新增產品" : "編輯產品"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeProductModal}
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="mb-5">
                  <label htmlFor="fileInput" className="form-label">
                    圖片上傳
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={fileChangeHandler}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      value={modalData.imageUrl}
                      onChange={modalInputChangehandler}
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={modalData.imageUrl}
                    alt={modalData.title}
                    className="img-fluid"
                  />
                </div>

                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {modalData.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        id={`imagesUrl-${index + 1}`}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                        value={image}
                        onChange={(e) => imageChangehandler(e, index)}
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}

                  <div className="btn-group w-100">
                    {modalData.imagesUrl.length < 5 &&
                      modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                        "" && (
                        <button
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={addImageHandler}
                        >
                          新增圖片
                        </button>
                      )}
                    {modalData.imagesUrl.length > 1 && (
                      <button
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={removeImageHandler}
                      >
                        取消圖片
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    value={modalData.title}
                    onChange={modalInputChangehandler}
                    placeholder="請輸入標題"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    name="category"
                    id="category"
                    type="text"
                    className="form-control"
                    value={modalData.category}
                    onChange={modalInputChangehandler}
                    placeholder="請輸入分類"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    name="unit"
                    id="unit"
                    type="text"
                    className="form-control"
                    value={modalData.unit}
                    onChange={modalInputChangehandler}
                    placeholder="請輸入單位"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      value={modalData.origin_price}
                      onChange={modalInputChangehandler}
                      placeholder="請輸入原價"
                      min="0"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      value={modalData.price}
                      onChange={modalInputChangehandler}
                      placeholder="請輸入售價"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    className="form-control"
                    value={modalData.description}
                    onChange={modalInputChangehandler}
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    className="form-control"
                    value={modalData.content}
                    onChange={modalInputChangehandler}
                    rows={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    checked={modalData.is_enabled}
                    onChange={modalInputChangehandler}
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeProductModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={updataProductHandler}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductModal.propTypes = {
  modalMode: PropTypes.oneOf(["create", "edit"]),
  tempProduct: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    category: PropTypes.string,
    unit: PropTypes.string,
    origin_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    content: PropTypes.string,
    is_enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    imageUrl: PropTypes.string,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
  }),
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  catchProducts: PropTypes.func,
};
