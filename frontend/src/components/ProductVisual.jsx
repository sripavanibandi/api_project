import React from "react";

export function getProductCategory(productName = "", productDesc = "", explicitCategory = "") {
  if (explicitCategory && explicitCategory.trim() !== "" && explicitCategory !== "All") {
    const raw = explicitCategory.trim().toLowerCase();
    if (raw.includes("elect")) return "Electronics";
    if (raw.includes("groc") || raw.includes("food")) return "Groceries";
    if (raw.includes("fash") || raw.includes("cloth") || raw.includes("apparel")) return "Fashion";
    if (raw.includes("home") || raw.includes("living")) return "Home & Living";
    if (raw.includes("beauty") || raw.includes("care") || raw.includes("skin")) return "Beauty & Personal Care";
    if (raw.includes("sport") || raw.includes("fitness")) return "Sports & Fitness";
    if (raw.includes("book") || raw.includes("stationery")) return "Books & Stationery";
    return explicitCategory;
  }

  const text = `${productName} ${productDesc}`.toLowerCase();

  // 1. ELECTRONICS & GADGETS (Checked first so tech brands like Apple do not match grocery fruit!)
  if (
    text.includes("laptop") ||
    text.includes("macbook") ||
    text.includes("iphone") ||
    text.includes("galaxy") ||
    text.includes("phone") ||
    text.includes("mobile") ||
    text.includes("smartphone") ||
    text.includes("headphone") ||
    text.includes("earphone") ||
    text.includes("earbud") ||
    text.includes("audio") ||
    text.includes("sound") ||
    text.includes("watch") ||
    text.includes("smartwatch") ||
    text.includes("tablet") ||
    text.includes("ipad") ||
    text.includes("camera") ||
    text.includes("charger") ||
    text.includes("oled") ||
    text.includes("display") ||
    text.includes("bionic") ||
    text.includes("snapdragon") ||
    text.includes("intel") ||
    text.includes("rtx") ||
    text.includes("bluetooth") ||
    text.includes("electronics")
  ) {
    return "Electronics";
  }

  // 2. GROCERIES & FOOD ITEMS
  if (
    text.includes("dal") ||
    text.includes("oil") ||
    text.includes("rice") ||
    text.includes("atta") ||
    text.includes("flour") ||
    text.includes("ghee") ||
    text.includes("milk") ||
    text.includes("coffee") ||
    text.includes("tea") ||
    text.includes("bread") ||
    text.includes("mango") ||
    text.includes("avocado") ||
    text.includes("chocolate") ||
    text.includes("muesli") ||
    text.includes("cereal") ||
    text.includes("snack") ||
    text.includes("sugar") ||
    text.includes("salt") ||
    text.includes("spice") ||
    text.includes("pulses") ||
    text.includes("fresh apple") ||
    text.includes("red apple") ||
    text.includes("fruit") ||
    text.includes("vegetable") ||
    text.includes("juice") ||
    text.includes("grocery") ||
    text.includes("food")
  ) {
    return "Groceries";
  }

  // 3. FASHION & APPAREL
  if (
    text.includes("shirt") ||
    text.includes("t-shirt") ||
    text.includes("polo") ||
    text.includes("jean") ||
    text.includes("pant") ||
    text.includes("trouser") ||
    text.includes("hoodie") ||
    text.includes("dress") ||
    text.includes("cloth") ||
    text.includes("jacket") ||
    text.includes("shoe") ||
    text.includes("sneaker") ||
    text.includes("apparel") ||
    text.includes("cotton") ||
    text.includes("tee") ||
    text.includes("sweater") ||
    text.includes("fashion") ||
    text.includes("wear")
  ) {
    return "Fashion";
  }

  // 4. HOME & LIVING
  if (
    text.includes("lamp") ||
    text.includes("light") ||
    text.includes("bottle") ||
    text.includes("flask") ||
    text.includes("thermosteel") ||
    text.includes("chair") ||
    text.includes("desk") ||
    text.includes("table") ||
    text.includes("sofa") ||
    text.includes("mug") ||
    text.includes("bed") ||
    text.includes("decor") ||
    text.includes("kitchen") ||
    text.includes("pillow") ||
    text.includes("furniture")
  ) {
    return "Home & Living";
  }

  return "Lifestyle";
}

export function ProductVisual({ productName = "", productDesc = "", category = "" }) {
  const text = `${productName} ${productDesc}`.toLowerCase();
  const effectiveCategory = category || getProductCategory(productName, productDesc);

  // 1. GROCERIES
  if (effectiveCategory === "Groceries") {
    // Fresh Fruits (Mango, Avocado, Apple)
    if (text.includes("mango") || text.includes("avocado") || text.includes("apple") || text.includes("fruit")) {
      return (
        <div className="product-visual-container">
          <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="62" r="32" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <path d="M78 30C78 26 82 22 86 20" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
            <path d="M84 24C88 22 96 24 96 28C96 32 88 32 84 24Z" fill="#22c55e" />
            <circle cx="70" cy="58" r="4" fill="#fbbf24" />
            <circle cx="92" cy="64" r="5" fill="#f59e0b" />
            <path d="M64 78C72 84 88 84 96 78" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // Beverage (Coffee / Tea)
    if (text.includes("coffee") || text.includes("tea")) {
      return (
        <div className="product-visual-container">
          <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 48H106V82C106 90.8366 98.8366 98 90 98H66C57.1634 98 50 90.8366 50 82V48Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
            <path d="M106 58H116C120.418 58 124 61.5817 124 66C124 70.4183 120.418 74 116 74H106" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M68 36C68 32 72 28 72 24" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
            <path d="M88 36C88 32 92 28 92 24" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // Ghee / Oil
    if (text.includes("ghee") || text.includes("oil")) {
      return (
        <div className="product-visual-container">
          <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="58" y="44" width="44" height="60" rx="6" fill="#fef9c3" stroke="#eab308" strokeWidth="2" />
            <rect x="68" y="26" width="24" height="18" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="80" cy="74" r="10" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
            <path d="M80 68V78M75 73H85" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // Default Grocery Basket / Grains
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M44 48L52 98H108L116 48H44Z" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
          <path d="M64 48V32C64 27.5817 67.5817 24 72 24H88C92.4183 24 96 27.5817 96 32V48" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="80" cy="72" r="12" fill="#d1fae5" stroke="#34d399" strokeWidth="1.5" />
          <path d="M76 76C76 70 82 66 85 66C85 72 81 78 76 76Z" fill="#10b981" />
        </svg>
      </div>
    );
  }

  // 2. FASHION & APPAREL
  if (effectiveCategory === "Fashion") {
    if (text.includes("jean") || text.includes("denim") || text.includes("pant")) {
      return (
        <div className="product-visual-container">
          <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M52 24H108V40L102 100H84L80 56L76 100H58L52 40V24Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
            <line x1="52" y1="36" x2="108" y2="36" stroke="#2563eb" strokeWidth="1.5" />
            <circle cx="80" cy="30" r="2.5" fill="#1d4ed8" />
          </svg>
        </div>
      );
    }

    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 18C77 18 75 20 75 23C75 26 80 27 80 30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <path d="M58 34L32 46L42 66L54 60V102H106V60L118 66L128 46L102 34C96 42 64 42 58 34Z" fill="#eff6ff" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round" />
          <path d="M66 34C72 40 88 40 94 34" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 3. HOME & LIVING
  if (effectiveCategory === "Home & Living") {
    if (text.includes("bottle") || text.includes("flask") || text.includes("thermosteel")) {
      return (
        <div className="product-visual-container">
          <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="66" y="38" width="28" height="66" rx="6" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <rect x="72" y="20" width="16" height="18" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <line x1="66" y1="60" x2="94" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }

    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M56 50L68 22H92L104 50H56Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
          <line x1="80" y1="50" x2="80" y2="94" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          <path d="M64 96H96" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
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

  // 5. ELECTRONICS: Headphones / Audio
  if (text.includes("headphone") || text.includes("audio") || text.includes("earphone")) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 66C42 42.804 60.804 24 84 24C107.196 24 126 42.804 126 66" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 66C50 47.2223 65.2223 32 84 32C102.778 32 118 47.2223 118 66" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          <rect x="34" y="60" width="16" height="34" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="42" y="66" width="4" height="22" rx="2" fill="#64748b" />
          <rect x="118" y="60" width="16" height="34" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="122" y="66" width="4" height="22" rx="2" fill="#64748b" />
        </svg>
      </div>
    );
  }

  // 6. ELECTRONICS: Smartwatch
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
        </svg>
      </div>
    );
  }

  // 7. ELECTRONICS: Tablet / iPad
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

  // 8. ELECTRONICS: Mobile Phones (iPhone, Samsung, OnePlus, etc.)
  if (
    text.includes("iphone") ||
    text.includes("galaxy") ||
    text.includes("phone") ||
    text.includes("mobile") ||
    text.includes("smartphone") ||
    text.includes("nord")
  ) {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="56" y="14" width="48" height="92" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <rect x="60" y="18" width="40" height="84" rx="8" fill="#020617" />
          <rect x="73" y="22" width="14" height="4" rx="2" fill="#1e293b" />
          <circle cx="80" cy="52" r="10" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="68" y="70" width="24" height="3" rx="1.5" fill="#64748b" />
          <rect x="72" y="96" width="16" height="2" rx="1" fill="#64748b" />
        </svg>
      </div>
    );
  }

  // 9. BEAUTY & PERSONAL CARE
  if (effectiveCategory === "Beauty & Personal Care") {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="62" y="42" width="36" height="60" rx="8" fill="#fdf2f8" stroke="#ec4899" strokeWidth="2" />
          <rect x="70" y="24" width="20" height="18" rx="3" fill="#fce7f3" stroke="#db2777" strokeWidth="1.5" />
          <circle cx="80" cy="70" r="8" fill="#fbcfe8" stroke="#f472b6" strokeWidth="1.5" />
          <path d="M76 70C76 66 80 64 84 64" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 10. SPORTS & FITNESS
  if (effectiveCategory === "Sports & Fitness") {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="36" y="46" width="16" height="28" rx="4" fill="#f1f5f9" stroke="#0ea5e9" strokeWidth="2" />
          <rect x="108" y="46" width="16" height="28" rx="4" fill="#f1f5f9" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="52" y1="60" x2="108" y2="60" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
          <rect x="74" y="55" width="12" height="10" rx="2" fill="#38bdf8" />
        </svg>
      </div>
    );
  }

  // 11. BOOKS & STATIONERY
  if (effectiveCategory === "Books & Stationery") {
    return (
      <div className="product-visual-container">
        <svg viewBox="0 0 160 120" className="product-svg-art" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M42 34C54 30 76 32 80 38C84 32 106 30 118 34V94C106 90 84 92 80 98C76 92 54 90 42 94V34Z" fill="#f8fafc" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
          <line x1="80" y1="38" x2="80" y2="98" stroke="#4f46e5" strokeWidth="2" />
          <line x1="52" y1="48" x2="72" y2="48" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="58" x2="70" y2="58" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="88" y1="48" x2="108" y2="48" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
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
