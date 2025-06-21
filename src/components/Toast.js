import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../redux/actions"; // Import action creator

const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.toast);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, dispatch]);

  if (!toast.show) return null;

  return (
    <div
      className={`toast show position-fixed top-0 end-0 m-3`}
      style={{ zIndex: 1055 }}
    >
      <div
        className={`toast-header bg-${
          toast.type === "success" ? "success" : "danger"
        } text-white`}
      >
        <strong className="me-auto">Notification</strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={() => dispatch(hideToast())}
        ></button>
      </div>
      <div className="toast-body">{toast.message}</div>
    </div>
  );
};

export default Toast;
