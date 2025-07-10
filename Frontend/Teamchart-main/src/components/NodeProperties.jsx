import ReactDOM from "react-dom";

const tooltipRoot = document.getElementById("tooltip-root") || (() => {
  const el = document.createElement("div");
  el.id = "tooltip-root";
  document.body.appendChild(el);
  return el;
})();

export default function TooltipPortal({ children, style }) {
  return ReactDOM.createPortal(
    <div style={{ position: "absolute", zIndex: 99999, ...style }}>
      {children}
    </div>,
    tooltipRoot
  );
}
