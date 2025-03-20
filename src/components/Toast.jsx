import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";
import { removeMessage } from "../store/toastSlice";

const TOAST_DURATION = 3000;

export default function Toast() {
  const messages = useSelector((state) => state.toast.messages);

  const toastRefs = useRef({});
  const dispatch = useDispatch();

  useEffect(() => {
    const timers = messages.map((message) => {
      const toastElement = toastRefs.current[message.id];
      if (toastElement instanceof HTMLElement) {
        const toastInstance = new BsToast(toastElement);
        toastInstance.show();
      }

      return setTimeout(() => {
        dispatch(removeMessage(message.id));
      }, TOAST_DURATION);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [messages, dispatch]);

  const handleDismiss = (message_id) => {
    dispatch(removeMessage(message_id));
  };

  return (
    <>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
        {messages.map((message) => {
          return (
            <div
              className="toast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              key={message.id}
              ref={(el) => {
                toastRefs.current[message.id] = el;
              }}
            >
              <div
                className={`toast-header ${
                  message.status === "success" ? "bg-success" : "bg-danger"
                } text-white`}
              >
                <strong className="me-auto">
                  {message.status === "success" ? "成功" : "失敗"}
                </strong>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => handleDismiss(message.id)}
                ></button>
              </div>
              <div className="toast-body">{message.text}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
