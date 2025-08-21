import React from "react";
import './Loading.css';

const Loading = ({ message, size = 250, fullscreen = true }) => {
  return (
    <div className={fullscreen ? "loading-screen" : "loading-inline"}>
      <div className="loading-content">
        <img
          src={require("@/assets/loading-screen-running-horse.gif")}
          alt="Loading horse"
          className="horse"
          style={{
            width: size,
            height: size,
            objectFit: "contain",
            verticalAlign: "middle",
            marginRight: fullscreen ? 0 : "8px",
          }}
        />

          <p
            className="loading-text"
            style={{
              fontSize: fullscreen ? "2rem" : "0.8rem",
              marginTop: fullscreen ? "20px" : "0",
            }}
          >
            {message || "טוען..."}
          </p>
      </div>
    </div>
  );
};

export default Loading;
