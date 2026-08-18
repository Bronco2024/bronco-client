import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import "./Loading.css";

const Loading = ({ message, size = 250, fullscreen = true }) => {
  const spinnerSize = fullscreen ? Math.min(size, 72) : Math.min(size, 28);

  return (
    <div className={fullscreen ? "loading-screen" : "loading-inline"}>
      <div className="loading-content">
        <span
          className="loading-mark"
          aria-hidden="true"
          style={{
            width: spinnerSize,
            height: spinnerSize,
            fontSize: spinnerSize * 0.42,
          }}
        >
          <FontAwesomeIcon icon={faPaw} />
        </span>

        <p
          className="loading-text"
          style={{
            fontSize: fullscreen ? "1.15rem" : "0.8rem",
            marginTop: fullscreen ? "16px" : "0",
          }}
        >
          {message || "טוען..."}
        </p>
      </div>
    </div>
  );
};

export default Loading;
