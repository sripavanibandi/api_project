import React, { useEffect, useState } from "react";
import {
  getProducts,
  createOrder,
  addOrderItem,
  getOrders,
  getOrder,
  getOrderItems,
  cancelOrder,
  updateOrderItemQuantity,
  generateInvoice
} from "./services/api";
import {
  CartIcon,
  OrdersIcon,
  SearchIcon,
  UserIcon,
  LogoutIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PlusIcon,
  MinusIcon,
  PrinterIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon
} from "./components/Icons";
import { ProductVisual, getProductCategory } from "./components/ProductVisual";
import "./App.css";

function numberToWordsINR(amount) {
  const n = Math.floor(Number(amount) || 0);
  if (n <= 0) return "Zero Rupees Only";

  const units = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function formatThreeDigits(val) {
    let s = "";
    if (val >= 100) {
      s += units[Math.floor(val / 100)] + " Hundred ";
      val %= 100;
    }
    if (val >= 20) {
      s += tens[Math.floor(val / 10)] + " ";
      val %= 10;
    }
    if (val > 0) {
      s += units[val] + " ";
    }
    return s.trim();
  }

  let result = "";
  const crore = Math.floor(n / 10000000);
  let rem = n % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;

  if (crore > 0) result += formatThreeDigits(crore) + " Crore ";
  if (lakh > 0) result += formatThreeDigits(lakh) + " Lakh ";
  if (thousand > 0) result += formatThreeDigits(thousand) + " Thousand ";
  if (rem > 0) result += formatThreeDigits(rem) + " ";

  return (result.trim() + " Rupees Only");
}

function App({ onLogout, currentUser }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const [invoice, setInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [view, setView] = useState("catalog"); // 'catalog' | 'cart' | 'checkout' | 'orders' | 'order-detail'
  const [placingOrder, setPlacingOrder] = useState(false);

  const loggedInUser = currentUser || JSON.parse(localStorage.getItem("user") || "{}");
  const customerName = loggedInUser.name || "Customer";
  const customerEmail = loggedInUser.email || "";

  // Delivery Address State
  const [deliveryStreet, setDeliveryStreet] = useState("Flat 402, Skyline Residency, MG Road");
  const [deliveryCity, setDeliveryCity] = useState("Bengaluru");
  const [deliveryState, setDeliveryState] = useState("Karnataka");
  const [deliveryPincode, setDeliveryPincode] = useState("560001");
  const [deliveryPhone, setDeliveryPhone] = useState("+91 98765 43210");
  const [addressPreset, setAddressPreset] = useState("home"); // "home" | "office" | "custom"

  function handleSelectPreset(preset) {
    setAddressPreset(preset);
    if (preset === "home") {
      setDeliveryStreet("Flat 402, Skyline Residency, MG Road");
      setDeliveryCity("Bengaluru");
      setDeliveryState("Karnataka");
      setDeliveryPincode("560001");
      setDeliveryPhone("+91 98765 43210");
    } else if (preset === "office") {
      setDeliveryStreet("Tech Hub Tower B, 5th Floor, Outer Ring Road");
      setDeliveryCity("Bengaluru");
      setDeliveryState("Karnataka");
      setDeliveryPincode("560103");
      setDeliveryPhone("+91 80 4123 4567");
    } else if (preset === "custom") {
      setDeliveryStreet("");
      setDeliveryCity("");
      setDeliveryState("");
      setDeliveryPincode("");
      setDeliveryPhone("");
    }
  }

  const productsPerPage = 8;

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      const productList = Array.isArray(data) ? data : data.content || [];
      setProducts(productList);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    try {
      setOrdersLoading(true);
      setError("");
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  }

  async function viewOrderDetail(orderId) {
    try {
      setError("");
      const order = await getOrder(orderId);
      const items = await getOrderItems(orderId);
      setSelectedOrder(order);
      setOrderItems(Array.isArray(items) ? items : items.content || []);
      setInvoice(null);
      setView("order-detail");
    } catch (err) {
      setError(err.message || "Failed to load order details");
    }
  }

  async function updateItemQuantity(itemId, quantity) {
    if (quantity < 1) return;
    try {
      setError("");
      await updateOrderItemQuantity(itemId, quantity);
      const items = await getOrderItems(selectedOrder.id);
      setOrderItems(Array.isArray(items) ? items : items.content || []);
      const updatedOrder = await getOrder(selectedOrder.id);
      setSelectedOrder(updatedOrder);
      setNotification("Item quantity updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update quantity.");
    }
  }

  async function handleGenerateInvoice(orderId) {
    try {
      setInvoiceLoading(true);
      setError("");
      const data = await generateInvoice(orderId);
      setInvoice(data);
      setNotification(`Official Tax Invoice #${data.invoiceId} generated successfully!`);
    } catch (err) {
      setError(err.message || "Failed to generate invoice");
    } finally {
      setInvoiceLoading(false);
    }
  }

  async function handleCancelOrder(orderId) {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) {
      return;
    }
    try {
      setError("");
      await cancelOrder(orderId);
      setNotification(`Order #${orderId} was cancelled.`);
      await loadOrders();
      if (selectedOrder?.id === orderId) {
        const updatedOrder = await getOrder(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      setError(err.message || "Could not cancel order.");
    }
  }

  function increaseProductQuantity(product) {
    setProductQuantities((current) => {
      const currentQty = current[product.id] || 1;
      if (currentQty >= product.quantity) return current;
      return { ...current, [product.id]: currentQty + 1 };
    });
  }

  function decreaseProductQuantity(product) {
    setProductQuantities((current) => {
      const currentQty = current[product.id] || 1;
      if (currentQty <= 1) return current;
      return { ...current, [product.id]: currentQty - 1 };
    });
  }

  function addToCart(product) {
    const selectedQty = productQuantities[product.id] || 1;
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        const newQty = existing.cartQuantity + selectedQty;
        if (newQty > product.quantity) return currentCart;
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, cartQuantity: newQty } : item
        );
      }
      return [...currentCart, { ...product, cartQuantity: selectedQty }];
    });

    setProductQuantities((current) => ({
      ...current,
      [product.id]: 1
    }));

    setNotification(`Added ${product.name} (${selectedQty}) to cart.`);
  }

  function increaseCartQty(productId) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id === productId) {
          if (item.cartQuantity >= item.quantity) return item;
          return { ...item, cartQuantity: item.cartQuantity + 1 };
        }
        return item;
      })
    );
  }

  function decreaseCartQty(productId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, cartQuantity: item.cartQuantity - 1 } : item
        )
        .filter((item) => item.cartQuantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  }

  async function handlePlaceOrder() {
    if (cart.length === 0) return;

    const addressParts = [
      deliveryStreet.trim(),
      deliveryCity.trim(),
      deliveryState.trim() && deliveryPincode.trim()
        ? `${deliveryState.trim()} - ${deliveryPincode.trim()}`
        : (deliveryState.trim() || deliveryPincode.trim())
    ].filter(Boolean);

    const fullAddress = addressParts.join(", ");
    if (!fullAddress || !deliveryPhone.trim()) {
      setError("Please provide a complete shipping address and contact phone number.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const order = await createOrder(customerName, customerEmail, fullAddress, deliveryPhone.trim());

      for (const item of cart) {
        await addOrderItem({
          orderId: order.id,
          productId: item.id,
          productName: item.name,
          quantity: item.cartQuantity,
          price: item.price
        });
      }

      setCart([]);
      setNotification(`Order #${order.id} placed successfully!`);
      await loadProducts();
      await loadOrders();
      setView("orders");
    } catch (err) {
      setError(err.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  }

  // Filter & Search Logic
  const allKnownCategories = [
    "All",
    "Electronics",
    "Fashion",
    "Groceries",
    "Home & Living",
    "Beauty & Personal Care",
    "Sports & Fitness",
    "Books & Stationery"
  ];
  const dynamicCategories = Array.from(
    new Set(
      products
        .map((p) => getProductCategory(p.name, p.description, p.category))
        .filter(Boolean)
    )
  );
  const categories = [
    "All",
    ...allKnownCategories.filter((c) => c !== "All" && dynamicCategories.includes(c)),
    ...dynamicCategories.filter((c) => !allKnownCategories.includes(c))
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());
      const cat = getProductCategory(product.name, product.description, product.category);
      const matchesCategory = selectedCategory === "All" || cat === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const cartItemCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  function getUserInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  return (
    <div className="store-layout">
      {/* GLOBAL NOTIFICATION BANNER */}
      {notification && (
        <div className="toast-notification success">
          <CheckCircleIcon size={18} />
          <span>{notification}</span>
          <button className="toast-dismiss" onClick={() => setNotification("")}>
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="toast-notification error">
          <AlertCircleIcon size={18} />
          <span>{error}</span>
          <button className="toast-dismiss" onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="store-header">
        <div className="header-inner">
          <div
            className="brand-group"
            onClick={() => {
              setView("catalog");
              setSelectedOrder(null);
            }}
          >
            <div className="brand-logo-mark">
              <span>SE</span>
            </div>
            <div className="brand-text">
              <span className="brand-title">ShopEase</span>
              <span className="brand-tagline">Department Store</span>
            </div>
          </div>

          <nav className="header-nav">
            <button
              className={`nav-link-btn ${view === "catalog" ? "active" : ""}`}
              onClick={() => {
                setView("catalog");
                setSelectedOrder(null);
              }}
            >
              Store Catalog
            </button>

            <button
              className={`nav-link-btn ${view === "orders" || view === "order-detail" ? "active" : ""}`}
              onClick={() => {
                setView("orders");
                setSelectedOrder(null);
                loadOrders();
              }}
            >
              <OrdersIcon size={17} />
              <span>Orders</span>
            </button>

            <button
              className={`cart-trigger-btn ${view === "cart" || view === "checkout" ? "active" : ""}`}
              onClick={() => setView("cart")}
            >
              <CartIcon size={18} />
              <span className="cart-text">Cart</span>
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>
          </nav>

          <div className="user-profile-badge">
            <div className="user-avatar" title={customerEmail}>
              {getUserInitials(customerName)}
            </div>
            <div className="user-info-text">
              <span className="user-name">{customerName}</span>
              <span className="user-email">{customerEmail}</span>
            </div>
            {onLogout && (
              <button className="signout-btn" onClick={onLogout} title="Sign Out">
                <LogoutIcon size={15} />
                <span>Exit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="store-main">
        {/* VIEW 1: CATALOG */}
        {view === "catalog" && (
          <div className="catalog-view">
            {/* EDITORIAL HERO SECTION */}
            <section className="editorial-hero">
              <div className="hero-content">
                <div className="hero-badge">
                  <ShieldCheckIcon size={14} />
                  <span>Curated Marketplace • Tech, Fashion, Groceries, Living, Beauty & More</span>
                </div>
                <h1>Everything You Need, Delivered.</h1>
                <p>
                  Discover fresh groceries, trending fashion, home essentials, top gadgets, wellness & books.
                  Quality-inspected with transparent pricing and express doorstep delivery.
                </p>
              </div>

              {/* QUICK STATS STRIP */}
              <div className="hero-metrics">
                <div className="metric-box">
                  <span className="metric-num">{products.length}</span>
                  <span className="metric-label">Curated Items</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-box">
                  <span className="metric-num">{categories.length > 1 ? categories.length - 1 : "Multi"}</span>
                  <span className="metric-label">Categories</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-box">
                  <span className="metric-num">Express</span>
                  <span className="metric-label">Fulfillment</span>
                </div>
              </div>
            </section>

            {/* FILTER & SEARCH BAR */}
            <section className="catalog-controls-bar">
              {/* Category Pills */}
              <div className="category-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Sort */}
              <div className="filter-inputs-group">
                <div className="search-field-wrapper">
                  <SearchIcon size={16} className="search-svg" />
                  <input
                    type="text"
                    placeholder="Search products across tech, fashion, groceries, beauty, books..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  {search && (
                    <button className="search-clear-btn" onClick={() => setSearch("")}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="sort-field-wrapper">
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Sort: Featured</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </section>

            {/* PRODUCT GRID */}
            {loading ? (
              <div className="loading-state-container">
                <div className="ui-spinner"></div>
                <p>Loading department catalog...</p>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="empty-catalog-state">
                <AlertCircleIcon size={36} />
                <h3>No Matching Products Found</h3>
                <p>Try adjusting your search query or switching categories.</p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="bento-product-grid">
                  {currentProducts.map((product) => {
                    const category = getProductCategory(product.name, product.description, product.category);
                    const isAvailable = product.quantity > 0;
                    const selectedQty = productQuantities[product.id] || 1;

                    return (
                      <article className="bento-card" key={product.id}>
                        {/* Card Header & Visual */}
                        <div className="card-visual-wrapper">
                          <div className="card-top-tags">
                            <span className="category-tag">{category}</span>
                            <span
                              className={`stock-indicator ${
                                isAvailable
                                  ? product.quantity <= 3
                                    ? "low-stock"
                                    : "in-stock"
                                  : "out-stock"
                              }`}
                            >
                              <span className="indicator-dot"></span>
                              {isAvailable
                                ? product.quantity <= 3
                                  ? `Only ${product.quantity} left`
                                  : `${product.quantity} available`
                                : "Out of stock"}
                            </span>
                          </div>

                          {product.imageUrl ? (
                            <div className="product-image-frame">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-photo-img"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = "flex";
                                  }
                                }}
                              />
                              <div className="product-photo-fallback" style={{ display: "none" }}>
                                <ProductVisual productName={product.name} productDesc={product.description} category={category} />
                              </div>
                            </div>
                          ) : (
                            <ProductVisual productName={product.name} productDesc={product.description} category={category} />
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="card-body">
                          <h2 className="product-title">{product.name}</h2>
                          <p className="product-desc">{product.description}</p>

                          <div className="product-pricing-row">
                            <div className="price-block">
                              <span className="currency-symbol">₹</span>
                              <span className="amount-value">
                                {Number(product.price).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <span className="tax-inclusive-label">Tax incl.</span>
                          </div>

                          {/* Action Row */}
                          <div className="card-actions-row">
                            {isAvailable && (
                              <div className="quantity-stepper">
                                <button
                                  type="button"
                                  onClick={() => decreaseProductQuantity(product)}
                                  disabled={selectedQty <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <MinusIcon size={12} />
                                </button>
                                <span className="stepper-value">{selectedQty}</span>
                                <button
                                  type="button"
                                  onClick={() => increaseProductQuantity(product)}
                                  disabled={selectedQty >= product.quantity}
                                  aria-label="Increase quantity"
                                >
                                  <PlusIcon size={12} />
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              className={`add-cart-btn ${!isAvailable ? "disabled" : ""}`}
                              onClick={() => addToCart(product)}
                              disabled={!isAvailable}
                            >
                              <CartIcon size={16} />
                              <span>{isAvailable ? "Add to Cart" : "Unavailable"}</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <nav className="pagination-bar">
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ArrowLeftIcon size={16} />
                      <span>Previous</span>
                    </button>

                    <div className="pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`page-num-btn ${currentPage === page ? "active" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      className="pagination-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <span>Next</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        )}

        {/* VIEW 2: CART */}
        {view === "cart" && (
          <section className="cart-checkout-container">
            <div className="section-header-row">
              <div>
                <h2>Review Shopping Cart</h2>
                <p>Manage quantities or proceed to order placement.</p>
              </div>
              <button className="back-link-btn" onClick={() => setView("catalog")}>
                <ArrowLeftIcon size={16} />
                <span>Continue Browsing</span>
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state-panel">
                <CartIcon size={40} />
                <h3>Your Cart is Empty</h3>
                <p>Explore our electronics catalog to select products for your order.</p>
                <button className="primary-action-btn" onClick={() => setView("catalog")}>
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="cart-grid-layout">
                {/* Cart Items List */}
                <div className="cart-items-column">
                  <div className="items-table-header">
                    <span>Product Details</span>
                    <span>Quantity</span>
                    <span>Item Total</span>
                    <span>Action</span>
                  </div>

                  {cart.map((item) => (
                    <div className="cart-row-card" key={item.id}>
                      <div className="item-info-group">
                        <div className="item-mini-visual">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="item-cart-photo"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div className="item-mini-fallback" style={{ display: item.imageUrl ? "none" : "flex" }}>
                            <ProductVisual productName={item.name} productDesc={item.description || ""} category={item.category} />
                          </div>
                        </div>
                        <div>
                          <h4 className="item-name">{item.name}</h4>
                          <span className="item-unit-price">
                            ₹{Number(item.price).toLocaleString("en-IN")} each
                          </span>
                        </div>
                      </div>

                      <div className="quantity-stepper">
                        <button
                          type="button"
                          onClick={() => decreaseCartQty(item.id)}
                          aria-label="Decrease item quantity"
                        >
                          <MinusIcon size={12} />
                        </button>
                        <span className="stepper-value">{item.cartQuantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseCartQty(item.id)}
                          disabled={item.cartQuantity >= item.quantity}
                          aria-label="Increase item quantity"
                        >
                          <PlusIcon size={12} />
                        </button>
                      </div>

                      <div className="item-row-total">
                        ₹{Number(item.price * item.cartQuantity).toLocaleString("en-IN")}
                      </div>

                      <button
                        className="item-delete-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Summary Sidebar */}
                <div className="cart-summary-sidebar">
                  <div className="summary-card">
                    <h3>Order Breakdown</h3>

                    <div className="summary-line">
                      <span>Subtotal ({cartItemCount} items)</span>
                      <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="summary-line">
                      <span>Express Shipping</span>
                      <span className="free-shipping-tag">Free</span>
                    </div>

                    <div className="summary-line">
                      <span>GST / Standard Tax</span>
                      <span>Included</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-line total-highlight">
                      <span>Total Due</span>
                      <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                    </div>

                    <button className="primary-action-btn full-width" onClick={() => setView("checkout")}>
                      Proceed to Checkout
                    </button>

                    <div className="trust-assurances">
                      <div className="assurance-item">
                        <ShieldCheckIcon size={16} />
                        <span>Verified SSL Transaction</span>
                      </div>
                      <div className="assurance-item">
                        <CheckCircleIcon size={16} />
                        <span>Direct OEM Manufacturer Warranty</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* VIEW 3: CHECKOUT */}
        {view === "checkout" && (
          <section className="cart-checkout-container">
            <div className="section-header-row">
              <div>
                <h2>Final Checkout & Confirmation</h2>
                <p>Review customer details and dispatch information before submission.</p>
              </div>
              <button className="back-link-btn" onClick={() => setView("cart")}>
                <ArrowLeftIcon size={16} />
                <span>Return to Cart</span>
              </button>
            </div>

            <div className="checkout-layout-grid">
              {/* Customer & Delivery Form */}
              <div className="checkout-main-column">
                <div className="checkout-form-panel">
                  <h3>Customer & Delivery Profile</h3>

                  <div className="profile-verified-card">
                    <div className="verified-chip">
                      <CheckCircleIcon size={14} />
                      <span>Authenticated Account</span>
                    </div>

                    <div className="info-grid">
                      <div>
                        <span className="field-hint">Recipient Name</span>
                        <strong className="field-val">{customerName}</strong>
                      </div>
                      <div>
                        <span className="field-hint">Registered Email</span>
                        <strong className="field-val">{customerEmail}</strong>
                      </div>
                      <div>
                        <span className="field-hint">Order Status</span>
                        <span className="status-pill confirmed">CONFIRMED (ON SUBMISSION)</span>
                      </div>
                      <div>
                        <span className="field-hint">Dispatch Mode</span>
                        <span className="field-val">Priority Express Courier</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Form */}
                  <div className="delivery-address-panel">
                    <div className="section-title-with-icon">
                      <MapPinIcon size={20} className="icon-gold" />
                      <div>
                        <h4 className="delivery-section-heading">Shipping & Delivery Destination</h4>
                        <p className="delivery-section-subtitle">
                          Choose a quick preset or specify the destination address for physical delivery
                        </p>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="address-preset-buttons">
                      <button
                        type="button"
                        className={`preset-btn ${addressPreset === "home" ? "active" : ""}`}
                        onClick={() => handleSelectPreset("home")}
                      >
                        <span className="preset-label">🏠 Home Residence</span>
                        <span className="preset-sub">MG Road, Bengaluru</span>
                      </button>
                      <button
                        type="button"
                        className={`preset-btn ${addressPreset === "office" ? "active" : ""}`}
                        onClick={() => handleSelectPreset("office")}
                      >
                        <span className="preset-label">🏢 Tech Hub Office</span>
                        <span className="preset-sub">Outer Ring Rd, Bengaluru</span>
                      </button>
                      <button
                        type="button"
                        className={`preset-btn ${addressPreset === "custom" ? "active" : ""}`}
                        onClick={() => handleSelectPreset("custom")}
                      >
                        <span className="preset-label">📍 Custom Destination</span>
                        <span className="preset-sub">Enter custom address</span>
                      </button>
                    </div>

                    {/* Form Inputs Grid */}
                    <div className="address-form-grid">
                      <div className="address-form-group full-width">
                        <label className="form-field-label">Street / House / Landmark Address *</label>
                        <input
                          type="text"
                          className="address-input-field"
                          placeholder="e.g. Flat 402, Skyline Residency, MG Road"
                          value={deliveryStreet}
                          onChange={(e) => {
                            setDeliveryStreet(e.target.value);
                            setAddressPreset("custom");
                          }}
                          required
                        />
                      </div>

                      <div className="address-form-group">
                        <label className="form-field-label">City *</label>
                        <input
                          type="text"
                          className="address-input-field"
                          placeholder="e.g. Bengaluru"
                          value={deliveryCity}
                          onChange={(e) => {
                            setDeliveryCity(e.target.value);
                            setAddressPreset("custom");
                          }}
                          required
                        />
                      </div>

                      <div className="address-form-group">
                        <label className="form-field-label">State / Region *</label>
                        <input
                          type="text"
                          className="address-input-field"
                          placeholder="e.g. Karnataka"
                          value={deliveryState}
                          onChange={(e) => {
                            setDeliveryState(e.target.value);
                            setAddressPreset("custom");
                          }}
                          required
                        />
                      </div>

                      <div className="address-form-group">
                        <label className="form-field-label">Postal PIN Code *</label>
                        <input
                          type="text"
                          className="address-input-field"
                          placeholder="e.g. 560001"
                          value={deliveryPincode}
                          onChange={(e) => {
                            setDeliveryPincode(e.target.value);
                            setAddressPreset("custom");
                          }}
                          required
                        />
                      </div>

                      <div className="address-form-group">
                        <label className="form-field-label">Delivery Contact Phone *</label>
                        <div className="input-with-icon-wrapper">
                          <PhoneIcon size={16} className="input-leading-icon" />
                          <input
                            type="tel"
                            className="address-input-field with-icon"
                            placeholder="e.g. +91 98765 43210"
                            value={deliveryPhone}
                            onChange={(e) => setDeliveryPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Assurance Banner */}
                    <div className="delivery-dispatch-banner">
                      <TruckIcon size={20} className="icon-truck" />
                      <div>
                        <strong>Priority Express Delivery (Free)</strong>
                        <span>Dispatched via verified courier with real-time transit tracking & invoice bill</span>
                      </div>
                    </div>
                  </div>

                  <h3 style={{ marginTop: "2rem" }}>Payment Method</h3>
                  <div className="payment-method-selector">
                    <div className="payment-card selected">
                      <input type="radio" checked readOnly name="payment" id="cod" />
                      <label htmlFor="cod">
                        <strong>Official Direct Invoicing / Cash on Delivery</strong>
                        <span>Corporate invoice generated instantly with dispatch details</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Confirmation Summary */}
              <div className="checkout-summary-column">
                <div className="summary-card">
                  <h3>Line Items Summary</h3>

                  <div className="checkout-items-list">
                    {cart.map((item) => (
                      <div className="checkout-item-line" key={item.id}>
                        <div className="item-title-qty">
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty-badge">× {item.cartQuantity}</span>
                        </div>
                        <span className="item-line-price">
                          ₹{(item.price * item.cartQuantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-line total-highlight">
                    <span>Grand Total</span>
                    <span>₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <button
                    className="primary-action-btn full-width"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                  >
                    {placingOrder ? (
                      <span className="spinner-wrap">
                        <span className="auth-spinner"></span>
                        Submitting Order...
                      </span>
                    ) : (
                      "Confirm & Place Order"
                    )}
                  </button>

                  <p className="order-disclaimer">
                    By confirming, your order will be recorded in the order management system.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 4: ORDERS LIST */}
        {view === "orders" && (
          <section className="orders-container">
            <div className="section-header-row">
              <div>
                <h2>Order History & Invoices</h2>
                <p>Track statuses, inspect item details, and download generated invoices.</p>
              </div>
              <button className="back-link-btn" onClick={() => setView("catalog")}>
                <ArrowLeftIcon size={16} />
                <span>Store Catalog</span>
              </button>
            </div>

            {ordersLoading ? (
              <div className="loading-state-container">
                <div className="ui-spinner"></div>
                <p>Retrieving your order records...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state-panel">
                <OrdersIcon size={40} />
                <h3>No Previous Orders Found</h3>
                <p>You have not placed any orders yet. Browse our hardware to place your first order.</p>
                <button className="primary-action-btn" onClick={() => setView("catalog")}>
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="orders-table-wrapper">
                <table className="orders-data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Total Value</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <span className="order-id-badge">#{ord.id}</span>
                        </td>
                        <td>
                          <span className="customer-cell">{ord.customerName}</span>
                        </td>
                        <td className="email-cell">{ord.customerEmail}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              ord.status === "CANCELLED"
                                ? "cancelled"
                                : ord.status === "CONFIRMED"
                                ? "confirmed"
                                : "pending"
                            }`}
                          >
                            <span className="indicator-dot"></span>
                            {ord.status}
                          </span>
                        </td>
                        <td>
                          <strong className="order-price-val">
                            ₹{Number(ord.totalPrice).toLocaleString("en-IN")}
                          </strong>
                        </td>
                        <td className="text-right">
                          <div className="table-actions-group">
                            <button
                              className="view-details-btn"
                              onClick={() => viewOrderDetail(ord.id)}
                            >
                              Details
                            </button>
                            {ord.status !== "CANCELLED" && (
                              <button
                                className="cancel-order-btn"
                                onClick={() => handleCancelOrder(ord.id)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* VIEW 5: ORDER DETAIL & INVOICE */}
        {view === "order-detail" && selectedOrder && (
          <section className="order-detail-container">
            <div className="section-header-row">
              <div>
                <h2>Order #{selectedOrder.id} Overview</h2>
                <p>Detailed item breakdown and official invoice generation.</p>
              </div>
              <button
                className="back-link-btn"
                onClick={() => {
                  setView("orders");
                  loadOrders();
                }}
              >
                <ArrowLeftIcon size={16} />
                <span>All Orders</span>
              </button>
            </div>

            <div className="order-detail-grid">
              {/* Left Column: Metadata & Items */}
              <div className="order-detail-main">
                {/* Order Status Card */}
                <div className="detail-meta-card">
                  <div className="meta-cell">
                    <span className="meta-label">Order Identifier</span>
                    <strong className="meta-val">#{selectedOrder.id}</strong>
                  </div>
                  <div className="meta-cell">
                    <span className="meta-label">Customer Name</span>
                    <strong className="meta-val">{selectedOrder.customerName}</strong>
                  </div>
                  <div className="meta-cell">
                    <span className="meta-label">Contact Email</span>
                    <strong className="meta-val">{selectedOrder.customerEmail}</strong>
                  </div>
                  <div className="meta-cell">
                    <span className="meta-label">Current Status</span>
                    <span
                      className={`status-pill ${
                        selectedOrder.status === "CANCELLED"
                          ? "cancelled"
                          : selectedOrder.status === "CONFIRMED"
                          ? "confirmed"
                          : "pending"
                      }`}
                    >
                      <span className="indicator-dot"></span>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Delivery & Shipping Destination Card */}
                <div className="delivery-destination-card">
                  <div className="card-top-header">
                    <div className="title-with-icon">
                      <MapPinIcon size={18} className="icon-gold" />
                      <h4>Delivery & Shipping Destination</h4>
                    </div>
                    <span className="dispatch-badge">
                      <TruckIcon size={14} />
                      {selectedOrder.status === "CANCELLED" ? "Delivery Cancelled" : "Priority Express Dispatch"}
                    </span>
                  </div>

                  <div className="delivery-dest-grid">
                    <div className="dest-address-block">
                      <span className="dest-label">Physical Shipping Destination</span>
                      <p className="dest-address-text">
                        {selectedOrder.deliveryAddress || "Standard Registered Delivery Address"}
                      </p>
                    </div>

                    <div className="dest-contact-block">
                      <span className="dest-label">Recipient Phone</span>
                      <p className="dest-contact-text">
                        <PhoneIcon size={14} />
                        <span>{selectedOrder.deliveryPhone || "Not specified"}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="order-items-card">
                  <h3>Purchased Items ({orderItems.length})</h3>

                  {orderItems.length === 0 ? (
                    <p className="no-items-text">No items recorded for this order.</p>
                  ) : (
                    <div className="order-items-table">
                      {orderItems.map((item) => (
                        <div className="order-item-row" key={item.id}>
                          <div className="order-item-name-col">
                            <strong>{item.productName}</strong>
                            <span className="unit-cost">
                              ₹{Number(item.price).toLocaleString("en-IN")} each
                            </span>
                          </div>

                          <div className="order-item-qty-col">
                            <span className="qty-tag">Qty: {item.quantity}</span>
                            {selectedOrder.status !== "CANCELLED" && (
                              <div className="quantity-stepper small">
                                <button
                                  type="button"
                                  disabled={item.quantity <= 1}
                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                  aria-label="Decrease quantity"
                                >
                                  <MinusIcon size={10} />
                                </button>
                                <span className="stepper-value">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                >
                                  <PlusIcon size={10} />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="order-item-subtotal-col">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="order-total-bar">
                    <span>Order Total:</span>
                    <strong>₹{Number(selectedOrder.totalPrice).toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Invoice Management */}
              <div className="order-invoice-sidebar">
                <div className="invoice-action-card">
                  <h3>Official Tax Invoice</h3>
                  <p>Generate and view the enterprise tax invoice for this order record.</p>

                  {selectedOrder.status === "CANCELLED" ? (
                    <div className="invoice-cancelled-notice">
                      <AlertCircleIcon size={16} />
                      <span>Invoice unavailable for cancelled orders.</span>
                    </div>
                  ) : (
                    <button
                      className="generate-invoice-btn"
                      onClick={() => handleGenerateInvoice(selectedOrder.id)}
                      disabled={invoiceLoading}
                    >
                      <PrinterIcon size={16} />
                      <span>{invoiceLoading ? "Generating..." : "Generate Official Invoice"}</span>
                    </button>
                  )}

                  {invoice && (
                    <div className="invoice-rendered-document" id="invoice-doc">
                      {/* Super Header / Brand & Meta */}
                      <div className="invoice-super-header">
                        <div className="company-official-block">
                          <div className="company-logo-text">
                            <span className="brand-dot"></span>
                            <h4>ShopEase Corporation Pvt. Ltd.</h4>
                          </div>
                          <p className="company-legal-info">
                            <strong>CIN:</strong> U72200KA2024PTC198421 &nbsp;|&nbsp; <strong>GSTIN:</strong> 29AAECS9876K1Z9<br />
                            <strong>Registered Office:</strong> Plot 42, Tech Corridor, Outer Ring Road, Bengaluru, Karnataka - 560103<br />
                            <strong>Support:</strong> support@shopease.com &nbsp;|&nbsp; <strong>Toll-Free:</strong> 1800-200-EASE (24×7)
                          </p>
                        </div>

                        <div className="invoice-title-meta-block">
                          <div className="doc-category-badge">TAX INVOICE / BILL OF SUPPLY</div>
                          <span className="invoice-badge paid-confirmed">
                            <CheckCircleIcon size={13} />
                            <span>PAID / CONFIRMED</span>
                          </span>
                          <div className="key-meta-rows">
                            <div className="meta-pair">
                              <span className="meta-k">Invoice Ref:</span>
                              <strong className="meta-v">{invoice.invoiceId}</strong>
                            </div>
                            <div className="meta-pair">
                              <span className="meta-k">Date of Issue:</span>
                              <strong className="meta-v">
                                {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </strong>
                            </div>
                            <div className="meta-pair">
                              <span className="meta-k">Order Reference:</span>
                              <strong className="meta-v">#{invoice.orderId}</strong>
                            </div>
                            <div className="meta-pair">
                              <span className="meta-k">Payment Mode:</span>
                              <strong className="meta-v">Direct Invoice / Pay on Delivery</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="invoice-divider"></div>

                      {/* Billed To and Delivered To Party Cards */}
                      <div className="invoice-parties-grid">
                        <div className="party-card billed-to">
                          <span className="party-role-tag">Customer / Billed To</span>
                          <h5 className="party-name">{invoice.customerName}</h5>
                          <div className="party-meta-details">
                            <div className="party-meta-line">
                              <span className="meta-title">Email:</span>
                              <span className="meta-data">{invoice.customerEmail}</span>
                            </div>
                            <div className="party-meta-line">
                              <span className="meta-title">Phone:</span>
                              <span className="meta-data">{invoice.deliveryPhone || selectedOrder.deliveryPhone || "Not specified"}</span>
                            </div>
                            <div className="party-meta-line">
                              <span className="meta-title">Client Type:</span>
                              <span className="meta-data">Authenticated Retail Consumer</span>
                            </div>
                          </div>
                        </div>

                        <div className="party-card shipped-to">
                          <span className="party-role-tag">Consignee / Delivering To</span>
                          <h5 className="party-name">{invoice.customerName}</h5>
                          <div className="party-meta-details">
                            <div className="party-meta-line">
                              <span className="meta-title">Destination:</span>
                              <span className="meta-data address-val">
                                {invoice.deliveryAddress || selectedOrder.deliveryAddress || "Standard Registered Delivery Address"}
                              </span>
                            </div>
                            <div className="party-meta-line">
                              <span className="meta-title">Delivery Phone:</span>
                              <span className="meta-data">{invoice.deliveryPhone || selectedOrder.deliveryPhone || "Not specified"}</span>
                            </div>
                            <div className="party-meta-line">
                              <span className="meta-title">Logistics:</span>
                              <span className="meta-data">Priority Express Courier (Tracked)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Itemized Products Table */}
                      <div className="invoice-table-wrapper">
                        <table className="invoice-items-table">
                          <thead>
                            <tr>
                              <th style={{ width: "5%" }}>#</th>
                              <th style={{ width: "45%" }}>Item Description</th>
                              <th style={{ width: "12%" }}>HSN/SAC</th>
                              <th style={{ width: "8%", textAlign: "center" }}>Qty</th>
                              <th style={{ width: "15%", textAlign: "right" }}>Unit Price</th>
                              <th style={{ width: "15%", textAlign: "right" }}>Total (INR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderItems && orderItems.length > 0 ? (
                              orderItems.map((item, idx) => (
                                <tr key={item.id || idx}>
                                  <td>{idx + 1}</td>
                                  <td>
                                    <strong className="invoice-item-title">{item.productName}</strong>
                                  </td>
                                  <td className="hsn-cell">8500{idx + 1}</td>
                                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                                  <td style={{ textAlign: "right" }}>
                                    ₹{Number(item.price).toLocaleString("en-IN")}
                                  </td>
                                  <td style={{ textAlign: "right" }} className="line-total-cell">
                                    ₹{Number(item.price * item.quantity).toLocaleString("en-IN")}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td>1</td>
                                <td>
                                  <strong className="invoice-item-title">Enterprise Order Hardware Items</strong>
                                </td>
                                <td className="hsn-cell">8528</td>
                                <td style={{ textAlign: "center" }}>1</td>
                                <td style={{ textAlign: "right" }}>
                                  ₹{Number(invoice.totalAmount).toLocaleString("en-IN")}
                                </td>
                                <td style={{ textAlign: "right" }} className="line-total-cell">
                                  ₹{Number(invoice.totalAmount).toLocaleString("en-IN")}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Financial Calculations & Declarations */}
                      <div className="invoice-bottom-grid">
                        <div className="invoice-terms-notes">
                          <div className="words-amount-box">
                            <span className="words-label">Invoice Amount in Words:</span>
                            <strong className="words-val">
                              {numberToWordsINR(invoice.totalAmount)}
                            </strong>
                          </div>

                          <div className="terms-container">
                            <span className="terms-title">Terms & Conditions:</span>
                            <ol className="terms-list">
                              <li>Goods once delivered are covered under a 12-month standard manufacturer warranty.</li>
                              <li>7-day replacement guarantee against transit defects or hardware faults.</li>
                              <li>Subject to Bengaluru jurisdiction. Errors & omissions excepted (E. & O.E.).</li>
                            </ol>
                          </div>
                        </div>

                        <div className="invoice-tax-summary-card">
                          {(() => {
                            const tot = Number(invoice.totalAmount) || 0;
                            const taxable = Math.round((tot / 1.18) * 100) / 100;
                            const tax = Math.round((tot - taxable) * 100) / 100;
                            const halfTax = (tax / 2).toFixed(2);
                            return (
                              <>
                                <div className="tax-summary-line">
                                  <span>Taxable Subtotal:</span>
                                  <span>₹{taxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="tax-summary-line">
                                  <span>CGST (9.0%):</span>
                                  <span>₹{halfTax}</span>
                                </div>
                                <div className="tax-summary-line">
                                  <span>SGST (9.0%):</span>
                                  <span>₹{halfTax}</span>
                                </div>
                                <div className="tax-summary-line">
                                  <span>Express Courier Delivery:</span>
                                  <span className="free-shipping-text">₹0.00 (FREE)</span>
                                </div>
                                <div className="invoice-total-highlight-row">
                                  <span>Grand Total (INR):</span>
                                  <span className="grand-total-val">₹{tot.toLocaleString("en-IN")}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Signature & Seal Footer */}
                      <div className="invoice-sign-footer">
                        <div className="digital-verification-stamp">
                          <ShieldCheckIcon size={20} className="shield-icon" />
                          <div>
                            <span className="verify-title">Digitally Certified Tax Invoice</span>
                            <span className="verify-hash">Verification Hash: SHA256-INV-{invoice.invoiceId}-{invoice.orderId}</span>
                            <span className="verify-note">This is an electronically generated tax invoice under CGST Act, 2017. Physical signature not required.</span>
                          </div>
                        </div>

                        <div className="signatory-box">
                          <div className="sign-stamp-badge">
                            <span className="stamp-name">ShopEase Corp</span>
                            <span className="stamp-sub">Official Digital Seal</span>
                          </div>
                          <span className="sign-designation">For ShopEase Corporation Pvt. Ltd.</span>
                          <span className="sign-sub">Authorised Signatory</span>
                        </div>
                      </div>

                      {/* Print Button (hidden during print) */}
                      <div className="invoice-print-actions">
                        <button
                          type="button"
                          className="print-invoice-btn"
                          onClick={() => window.print()}
                        >
                          <PrinterIcon size={16} />
                          <span>Print / Save Tax Invoice (PDF)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;