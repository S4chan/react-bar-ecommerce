import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import PropTypes from "prop-types";

export default function MessageModal({
  isOpen,
  onClose,
  message,
  type = "success",
}) {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalInstance.current = new Modal(modalRef.current, {
        keyboard: true,
        backdrop: true,
      });
    }
    return () => {
      modalInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      modalInstance.current?.show();
    } else {
      modalInstance.current?.hide();
    }
  }, [isOpen]);

  const getModalClass = () => {
    switch (type) {
      case "success":
        return "text-success";
      case "error":
        return "text-danger";
      default:
        return "text-primary";
    }
  };

  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex="-1"
      aria-labelledby="messageModalLabel"
      role="dialog"
      aria-modal="true"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              className={`modal-title ${getModalClass()}`}
              id="messageModalLabel"
            >
              {type === "success" ? "成功" : "錯誤"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

MessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info"]),
};
