import React from "react";
import { Link } from "react-router-dom";
import { SITE_NAME } from "@/data/site-config";
import "./InfoPageShell.css";

const INFO_NAV = [
  { path: "/about-us", label: "אודותינו" },
  { path: "/regulations", label: "תקנון" },
  { path: "/privacy-policy", label: "מדיניות פרטיות" },
];

const InfoPageShell = ({
  kicker = SITE_NAME,
  title,
  subtitle,
  updatedAt,
  currentPath,
  children,
}) => (
  <main className="info-page" dir="rtl">
    <header className="info-page-hero">
      <div className="info-page-hero-glow" aria-hidden="true" />
      <div className="info-page-hero-inner">
        <p className="info-page-brand">{kicker}</p>
        <h1>{title}</h1>
        {subtitle ? <p className="info-page-subtitle">{subtitle}</p> : null}
        {updatedAt ? (
          <p className="info-page-updated">עדכון אחרון: {updatedAt}</p>
        ) : null}
      </div>
    </header>

    <nav className="info-page-nav" aria-label="דפי מידע">
      <div className="info-page-nav-inner">
        {INFO_NAV.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`info-page-nav-link${
              currentPath === item.path ? " is-active" : ""
            }`}
            aria-current={currentPath === item.path ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>

    <div className="info-page-body">{children}</div>
  </main>
);

export default InfoPageShell;
