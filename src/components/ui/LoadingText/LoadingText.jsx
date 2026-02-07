import React from "react";
import "./LoadingText.scss";

export default function LoadingText({ text = "Đang tải dữ liệu..." }) {
  return (
    <div className="loading-text">
      {text}
    </div>
  );
}
