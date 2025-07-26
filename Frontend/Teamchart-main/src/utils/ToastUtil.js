import { toast } from 'react-toastify';

const baseStyle = {
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: "15px",
  padding: "12px 16px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

export const showSuccess = (message) =>
  toast.success(message, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...baseStyle,
      background: "#e6fffa",
      color: "#00695c",
      border: "1px solid #b2dfdb",
    },
    icon: "🎉",
  });

export const showError = (message) =>
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      ...baseStyle,
      background: "#fff1f0",
      color: "#d32f2f",
      border: "1px solid #ffcdd2",
    },
    icon: "🚫",
  });

export const showInfo = (message) =>
  toast.info(message, {
    position: "top-center",
    autoClose: 2800,
    style: {
      ...baseStyle,
      background: "#e3f2fd",
      color: "#1976d2",
      border: "1px solid #bbdefb",
    },
    icon: "ℹ️",
  });
