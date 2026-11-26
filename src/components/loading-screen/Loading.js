import React from "react";
import { SITE_NAME } from "@/data/site-config";
import "./Loading.css";

const Loading = ({ message, size = 250, fullscreen = true }) => {
  const logoHeight = fullscreen ? Math.min(Math.round(size * 0.38), 88) : 28;

  return (
    <div className={fullscreen ? "loading-screen" : "loading-inline"}>
      <div className="loading-content">
        <picture>
          <source srcSet="/petzo-logo-mark.webp" type="image/webp" />
          <img
            className="loading-logo"
            src="/petzo-logo.jpg"
            alt=""
            aria-hidden="true"
            width={Math.round(logoHeight * 1.08)}
            height={logoHeight}
            style={{ height: logoHeight }}
            decoding="async"
          />
        </picture>

        <p
          className="loading-text"
          style={{
            fontSize: fullscreen ? "1.15rem" : "0.8rem",
            marginTop: fullscreen ? "16px" : "0",
          }}
        >
          {message || `טוען את ${SITE_NAME}...`}
        </p>
      </div>
    </div>
  );
};

export default Loading;
