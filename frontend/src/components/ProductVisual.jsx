import React from "react";

export function getProductCategory(productName = "", productDesc = "") {
  const text = `${productName} ${productDesc}`.toLowerCase();

  // Groceries & Food
  if (
    text.includes("milk") ||
    text.includes("coffee") ||
    text.includes("tea") ||
    text.includes("bread") ||
    text.includes("fruit") ||
    text.includes("apple") ||
    text.includes("banana") ||
    text.includes("vegetable") ||
    text.includes("rice") ||
    text.includes("oil") ||
    text.includes("snack") ||
    text.includes("organic") ||
    text.includes("juice") ||
    text.includes("egg") ||
    text.includes("flour") ||
    text.includes("cereal") ||
    text.includes("grocery") ||
    text.includes("food")
  ) {
    return "Groceries";
  }

  // Fashion & Apparel
  if (
    text.includes("shirt") ||
    text.includes("t-shirt") ||
    text.includes("pant") ||
    text.includes("jean") ||
    text.includes("hoodie") ||
    text.includes("dress") ||
    text.includes("cloth") ||
    text.includes("jacket") ||
    text.includes("shoe") ||
    text.includes("sneaker") ||
    text.includes("apparel") ||
    text.includes("cotton") ||
    text.includes("tee") ||
    text.includes("coat") ||
    text.includes("sock") ||
    text.includes("sweater") ||
    text.includes("fashion") ||
    text.includes("wear")
  ) {
    return "Fashion";
  }

  // Home & Living
  if (
    text.includes("lamp") ||
    text.includes("chair") ||
    text.includes("desk") ||
    text.includes("table") ||
    text.includes("sofa") ||
    text.includes("mug") ||
    text.includes("bed") ||
    text.includes("decor") ||
    text.includes("kitchen") ||
    text.includes("pillow") ||
    text.includes("furniture") ||
    text.includes("bottle")
  ) {
    return "Home & Living";
  }

  // Electronics & Hardware
  if (
    text.includes("laptop") ||
    text.includes("mobile") ||
    text.includes("phone") ||
    text.includes("iphone") ||
    text.includes("galaxy") ||
    text.includes("headphone") ||
    text.includes("audio") ||
    text.includes("earbud") ||
    text.includes("watch") ||
    text.includes("tablet") ||
    text.includes("pad") ||
    text.includes("screen") ||
    text.includes("camera") ||
    text.includes("charger") ||
    text.includes("electronics")
  ) {
    return "Electronics";
  }

  return "Lifestyle";
}

export function ProductVisual({ productName = "", productDesc = "" }) {
  const text = `${productName} ${productDesc}`.toLowerCase();
  const category = getProductCategory(productName, productDesc);

  // 1. GROCERIES
  if (category === "Groceries") {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Paper Grocery Bag */}
          <path d="M48 38L52 100H108L112 38H48Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M48 38L54 44H106L112 38H48Z" fill="#cbd5e1" />
          {/* Grocery Handles */}
          <path d="M66 38V24C66 20.6863 68.6863 18 72 18H88C91.3137 18 94 20.6863 94 24V38" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Organic Leaf / Fresh Badge */}
          <circle cx="80" cy="68" r="14" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1.5" />
          <path d="M76 72C76 66 82 62 85 62C85 68 81 74 76 72Z" fill="#10b981" />
          <path d="M75 73L84 64" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 2. FASHION & APPAREL
  if (category === "Fashion") {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hanger / T-Shirt Silhouette */}
          <path d="M80 18C77 18 75 20 75 23C75 26 80 27 80 30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          {/* Shirt Body */}
          <path d="M58 34L32 46L42 66L54 60V102H106V60L118 66L128 46L102 34C96 42 64 42 58 34Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
          {/* Collar Line */}
          <path d="M66 34C72 40 88 40 94 34" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          {/* Pocket accent */}
          <rect x="84" y="56" width="14" height="16" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // 3. HOME & LIVING
  if (category === "Home & Living") {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Table Lamp Shade */}
          <path d="M56 50L68 22H92L104 50H56Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
          {/* Lamp Stand */}
          <line x1="80" y1="50" x2="80" y2="94" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <path d="M64 96H96" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          {/* Warm glow aura */}
          <circle cx="80" cy="58" r="4" fill="#f59e0b" fillOpacity="0.8" />
        </svg>
      </div>
    );
  }

  // 4. ELECTRONICS: Laptops
  if (text.includes("laptop")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="28" y="20" width="104" height="66" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="34" y="26" width="92" height="54" rx="3" fill="#0f172a" />
          <rect x="42" y="36" width="38" height="6" rx="2" fill="#38bdf8" fillOpacity="0.8" />
          <rect x="42" y="48" width="56" height="4" rx="2" fill="#64748b" fillOpacity="0.6" />
          <rect x="42" y="56" width="46" height="4" rx="2" fill="#64748b" fillOpacity="0.4" />
          <circle cx="80" cy="23" r="1.5" fill="#64748b" />
          <path d="M14 90C14 88.3431 15.3431 87 17 87H143C144.657 87 146 88.3431 146 90V92C146 94.2091 144.209 96 142 96H18C15.7909 96 14 94.2091 14 92V90Z" fill="#334155" />
          <rect x="68" y="87" width="24" height="2" rx="1" fill="#64748b" />
          <rect x="24" y="96" width="112" height="2" rx="1" fill="#1e293b" />
        </svg>
      </div>
    );
  }

  // 5. ELECTRONICS: Audio
  if (text.includes("headphone") || text.includes("audio")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 66C42 42.804 60.804 24 84 24C107.196 24 126 42.804 126 66" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 66C50 47.2223 65.2223 32 84 32C102.778 32 118 47.2223 118 66" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <rect x="34" y="60" width="16" height="34" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="42" y="66" width="4" height="22" rx="2" fill="#64748b" />
          <rect x="118" y="60" width="16" height="34" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="122" y="66" width="4" height="22" rx="2" fill="#64748b" />
          <rect x="39" y="54" width="6" height="8" rx="2" fill="#475569" />
          <rect x="123" y="54" width="6" height="8" rx="2" fill="#475569" />
        </svg>
      </div>
    );
  }

  // 6. ELECTRONICS: Wearables / Watch
  if (text.includes("watch")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="68" y="12" width="24" height="26" rx="4" fill="#334155" />
          <rect x="68" y="82" width="24" height="26" rx="4" fill="#334155" />
          <rect x="54" y="32" width="52" height="56" rx="14" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
          <rect x="60" y="38" width="40" height="44" rx="9" fill="#020617" />
          <circle cx="80" cy="60" r="14" stroke="#38bdf8" strokeWidth="2" strokeDasharray="60" strokeDashoffset="18" fill="none" />
          <circle cx="80" cy="60" r="2.5" fill="#38bdf8" />
          <rect x="107" y="48" width="3" height="10" rx="1.5" fill="#64748b" />
        </svg>
      </div>
    );
  }

  // 7. ELECTRONICS: Tablet
  if (text.includes("tablet") || text.includes("pad")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="36" y="16" width="88" height="88" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="42" y="22" width="76" height="76" rx="6" fill="#0f172a" />
          <rect x="50" y="32" width="30" height="4" rx="2" fill="#38bdf8" fillOpacity="0.8" />
          <rect x="50" y="42" width="60" height="24" rx="4" fill="#1e293b" />
          <rect x="50" y="72" width="28" height="14" rx="3" fill="#334155" />
          <rect x="82" y="72" width="28" height="14" rx="3" fill="#334155" />
        </svg>
      </div>
    );
  }

  // 8. ELECTRONICS: Mobile
  if (text.includes("iphone") || text.includes("galaxy") || text.includes("mobile") || text.includes("phone")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="56" y="14" width="48" height="92" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <rect x="60" y="18" width="40" height="84" rx="8" fill="#020617" />
          <rect x="73" y="22" width="14" height="4" rx="2" fill="#1e293b" />
          <circle cx="80" cy="52" r="10" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="68" y="70" width="24" height="3" rx="1.5" fill="#64748b" />
          <rect x="71" y="77" width="18" height="2.5" rx="1.25" fill="#475569" />
          <rect x="72" y="96" width="16" height="2" rx="1" fill="#64748b" />
        </svg>
      </div>
    );
  }

  // Default: Universal Packaged Goods
  return (
    <div className="product-visual-container">
      <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="42" y="30" width="76" height="66" rx="8" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M42 50H118" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="80" y1="30" x2="80" y2="96" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="80" cy="64" r="8" fill="#e2e8f0" />
      </svg>
    </div>
  );
}
