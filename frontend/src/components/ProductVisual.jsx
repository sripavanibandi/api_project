import React from "react";

export function getProductCategory(productName = "") {
  const name = productName.toLowerCase();
  if (name.includes("laptop")) return "Computing";
  if (name.includes("iphone") || name.includes("galaxy") || name.includes("mobile") || name.includes("phone")) return "Mobile";
  if (name.includes("headphone") || name.includes("audio") || name.includes("earbud")) return "Audio";
  if (name.includes("watch")) return "Wearables";
  if (name.includes("tablet") || name.includes("pad")) return "Tablets";
  return "Electronics";
}

export function ProductVisual({ productName = "" }) {
  const name = productName.toLowerCase();

  if (name.includes("laptop")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Screen lid */}
          <rect x="28" y="20" width="104" height="66" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="34" y="26" width="92" height="54" rx="3" fill="#0f172a" />
          {/* Screen content glow lines */}
          <rect x="42" y="36" width="38" height="6" rx="2" fill="#38bdf8" fillOpacity="0.8" />
          <rect x="42" y="48" width="56" height="4" rx="2" fill="#64748b" fillOpacity="0.6" />
          <rect x="42" y="56" width="46" height="4" rx="2" fill="#64748b" fillOpacity="0.4" />
          {/* Webcam dot */}
          <circle cx="80" cy="23" r="1.5" fill="#64748b" />
          {/* Base */}
          <path d="M14 90C14 88.3431 15.3431 87 17 87H143C144.657 87 146 88.3431 146 90V92C146 94.2091 144.209 96 142 96H18C15.7909 96 14 94.2091 14 92V90Z" fill="#334155" />
          <rect x="68" y="87" width="24" height="2" rx="1" fill="#64748b" />
          {/* Base bottom stand */}
          <rect x="24" y="96" width="112" height="2" rx="1" fill="#1e293b" />
        </svg>
      </div>
    );
  }

  if (name.includes("headphone") || name.includes("audio")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Headband arch */}
          <path d="M42 66C42 42.804 60.804 24 84 24C107.196 24 126 42.804 126 66" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 66C50 47.2223 65.2223 32 84 32C102.778 32 118 47.2223 118 66" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          {/* Left Earcup */}
          <rect x="34" y="60" width="16" height="34" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="42" y="66" width="4" height="22" rx="2" fill="#64748b" />
          {/* Right Earcup */}
          <rect x="118" y="60" width="16" height="34" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="122" y="66" width="4" height="22" rx="2" fill="#64748b" />
          {/* Swivel mounts */}
          <rect x="39" y="54" width="6" height="8" rx="2" fill="#475569" />
          <rect x="123" y="54" width="6" height="8" rx="2" fill="#475569" />
        </svg>
      </div>
    );
  }

  if (name.includes("watch")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top Strap */}
          <rect x="68" y="12" width="24" height="26" rx="4" fill="#334155" />
          {/* Bottom Strap */}
          <rect x="68" y="82" width="24" height="26" rx="4" fill="#334155" />
          {/* Watch Body */}
          <rect x="54" y="32" width="52" height="56" rx="14" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
          {/* Screen */}
          <rect x="60" y="38" width="40" height="44" rx="9" fill="#020617" />
          {/* Dial Elements */}
          <circle cx="80" cy="60" r="14" stroke="#38bdf8" strokeWidth="2" strokeDasharray="60" strokeDashoffset="18" fill="none" />
          <circle cx="80" cy="60" r="2.5" fill="#38bdf8" />
          {/* Crown Button */}
          <rect x="107" y="48" width="3" height="10" rx="1.5" fill="#64748b" />
        </svg>
      </div>
    );
  }

  if (name.includes("tablet") || name.includes("pad")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tablet Body */}
          <rect x="36" y="16" width="88" height="88" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Screen */}
          <rect x="42" y="22" width="76" height="76" rx="6" fill="#0f172a" />
          {/* UI wireframe */}
          <rect x="50" y="32" width="30" height="4" rx="2" fill="#38bdf8" fillOpacity="0.8" />
          <rect x="50" y="42" width="60" height="24" rx="4" fill="#1e293b" />
          <rect x="50" y="72" width="28" height="14" rx="3" fill="#334155" />
          <rect x="82" y="72" width="28" height="14" rx="3" fill="#334155" />
        </svg>
      </div>
    );
  }

  // Default: Smartphone (iPhone, Galaxy, Mobile)
  return (
    <div className="product-visual-container">
      <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Phone Body */}
        <rect x="56" y="14" width="48" height="92" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        {/* Screen */}
        <rect x="60" y="18" width="40" height="84" rx="8" fill="#020617" />
        {/* Dynamic Island / Notch */}
        <rect x="73" y="22" width="14" height="4" rx="2" fill="#1e293b" />
        {/* Content Preview */}
        <circle cx="80" cy="52" r="10" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="68" y="70" width="24" height="3" rx="1.5" fill="#64748b" />
        <rect x="71" y="77" width="18" height="2.5" rx="1.25" fill="#475569" />
        {/* Home Bar */}
        <rect x="72" y="96" width="16" height="2" rx="1" fill="#64748b" />
      </svg>
    </div>
  );
}
