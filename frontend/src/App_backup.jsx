import { useEffect, useState } from "react";

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

import "./App.css";

function App() {
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
  const [orderSuccess, setOrderSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const productsPerPage = 3;

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();

      const productList = Array.isArray(data)
        ? data
        : data.content || [];

      setProducts(productList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    try {
      setOrdersLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(
        Array.isArray(data)
          ? data
          : data.content || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  }

  async function viewOrder(orderId) {
    try {
      setError("");

      const order = await getOrder(orderId);
      const items = await getOrderItems(orderId);

      setSelectedOrder(order);
      setOrderItems(
        Array.isArray(items)
          ? items
          : items.content || []
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateItemQuantity(itemId, quantity) {
    if (quantity < 1) {
      return;
    }

    try {
      setError("");

      await updateOrderItemQuantity(
        itemId,
        quantity
      );

      const items = await getOrderItems(
        selectedOrder.id
      );

      setOrderItems(
        Array.isArray(items)
          ? items
          : items.content || []
      );

      const updatedOrder = await getOrder(
        selectedOrder.id
      );

      setSelectedOrder(updatedOrder);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGenerateInvoice(orderId) {
    try {
      setInvoiceLoading(true);
      setError("");
      setInvoice(null);

      const data = await generateInvoice(orderId);

      setInvoice(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setInvoiceLoading(false);
    }
  }

  async function handleCancelOrder(orderId) {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order?"
      )
    ) {
      return;
    }

    try {
      setError("");

      await cancelOrder(orderId);

      setOrderSuccess(
        `Order ${orderId} cancelled successfully.`
      );

      await loadOrders();

      if (selectedOrder?.id === orderId) {
        const updatedOrder = await getOrder(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function increaseProductQuantity(product) {
  setProductQuantities((current) => {
    const currentQuantity =
      current[product.id] || 1;

    if (currentQuantity >= product.quantity) {
      return current;
    }

    return {
      ...current,
      [product.id]: currentQuantity + 1
    };
  });
}

function decreaseProductQuantity(product) {
  setProductQuantities((current) => {
    const currentQuantity =
      current[product.id] || 1;

    if (currentQuantity <= 1) {
      return current;
    }

    return {
      ...current,
      [product.id]: currentQuantity - 1
    };
  });
}


function addToCart(product) {
  const selectedQuantity =
    productQuantities[product.id] || 1;

  setCart((currentCart) => {
    const existing = currentCart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      const newQuantity =
        existing.cartQuantity +
        selectedQuantity;

      if (newQuantity > product.quantity) {
        return currentCart;
      }

      return currentCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              cartQuantity: newQuantity
            }
          : item
      );
    }

    return [
      ...currentCart,
      {
        ...product,
        cartQuantity: selectedQuantity
      }
    ];
  });

  setProductQuantities((current) => ({
    ...current,
    [product.id]: 1
  }));
}

  function increaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id === productId) {
          if (
            item.cartQuantity >= item.quantity
          ) {
            return item;
          }

          return {
            ...item,
            cartQuantity:
              item.cartQuantity + 1
          };
        }

        return item;
      })
    );
  }

  function decreaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                cartQuantity:
                  item.cartQuantity - 1
              }
            : item
        )
        .filter(
          (item) => item.cartQuantity > 0
        )
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  }

  function openCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setShowCart(false);
    setShowCheckout(true);
  }

  async function placeOrder() {
    if (
      !customerName.trim() ||
      !customerEmail.trim()
    ) {
      alert(
        "Please enter your name and email."
      );
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const order = await createOrder(
        customerName,
        customerEmail
      );

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
      setShowCheckout(false);

      setOrderSuccess(
        `Order placed successfully! Order ID: ${order.id}`
      );

      setCustomerName("");
      setCustomerEmail("");

      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  }

  function openOrders() {
    setShowOrders(true);
    setShowCart(false);
    setShowCheckout(false);
    setSelectedOrder(null);
    loadOrders();
  }

  const filteredProducts = products
    .filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "low") {
        return a.price - b.price;
      }

      if (sortOrder === "high") {
        return b.price - a.price;
      }

      return 0;
    });

  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.cartQuantity,
    0
  );

  return (
    <div className="app-container">

      {/* NAVBAR */}

      <nav className="navbar">
        <div className="logo">
          🛍️ ShopEase
        </div>

        <div className="nav-buttons">
          <button
            className="nav-button"
            onClick={() => {
              setShowCart(false);
              setShowCheckout(false);
              setShowOrders(false);
              setSelectedOrder(null);
            }}
          >
            Products
          </button>

          <button
            className="nav-button"
            onClick={() => setShowCart(true)}
          >
            🛒 Cart ({cart.length})
          </button>

          <button
            className="nav-button"
            onClick={openOrders}
          >
            My Orders
          </button>
        </div>
      </nav>

      <main className="main-content">

        {/* ALERTS */}

        {orderSuccess && (
          <div className="alert success">
            {orderSuccess}
            <button
              className="secondary-button"
              onClick={() =>
                setOrderSuccess("")
              }
            >
              Close
            </button>
          </div>
        )}

        {error && (
          <div className="alert error">
            {error}
            <button
              className="secondary-button"
              onClick={() => setError("")}
            >
              Close
            </button>
          </div>
        )}

        {/* PRODUCTS */}

        {!showCart &&
          !showCheckout &&
          !showOrders && (
            <>
              <section className="hero">
                <h1>
                  Find What You Need
                </h1>

                <p>
                  Browse our products,
                  add them to your cart
                  and place your order
                  easily.
                </p>
              </section>

              <div className="controls">
                <input
                  className="search-box"
                  type="text"
                  placeholder="🔍 Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />

                <select
                  className="sort-box"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">
                    Sort by Price
                  </option>

                  <option value="low">
                    Low to High
                  </option>

                  <option value="high">
                    High to Low
                  </option>
                </select>
              </div>

              {loading ? (
                <div className="empty">
                  <h2>
                    Loading products...
                  </h2>
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="empty">
                  <h2>
                    No products found
                  </h2>
                </div>
              ) : (
                <div className="product-grid">
                  {currentProducts.map(
                    (product) => (
                      <div
                        className="product-card"
                        key={product.id}
                      >
                        <div className="product-icon">
                          {product.name
                            .toLowerCase()
                            .includes("mobile")
                            ? "📱"
                            : "💻"}
                        </div>

                        <h2>
                          {product.name}
                        </h2>

                        <p className="product-description">
                          {product.description}
                        </p>

                        <p className="product-price">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p className="stock">
                          {product.quantity > 0
                            ? `${product.quantity} available`
                            : "Out of stock"}
                        </p>

                        {product.quantity > 0 && (
                          <div className="product-quantity-controls">
                            <button
                              className="quantity-button"
                              onClick={() =>
                                decreaseProductQuantity(product)
                              }
                              disabled={
                                (productQuantities[product.id] || 1) <= 1
                              }
                            >
                              −
                            </button>

                            <strong>
                              {productQuantities[product.id] || 1}
                            </strong>

                            <button
                              className="quantity-button"
                              onClick={() =>
                                increaseProductQuantity(product)
                              }
                              disabled={
                                (productQuantities[product.id] || 1) >=
                                product.quantity
                              }
                            >
                              +
                            </button>
                          </div>
                        )}

                        <button
                          className="primary-button"
                          onClick={() =>
                            addToCart(product)
                          }
                          disabled={
                            product.quantity ===
                            0
                          }
                        >
                          Add to Cart
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage - 1
                      )
                    }
                  >
                    Previous
                  </button>

                  <span>
                    Page {currentPage} of{" "}
                    {totalPages}
                  </span>

                  <button
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage + 1
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        {/* CART */}

        {showCart && !showCheckout && (
          <section className="cart-section">
            <h1>Shopping Cart</h1>

            {cart.length === 0 ? (
              <div className="empty">
                <h2>
                  Your cart is empty
                </h2>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowCart(false)
                  }
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    className="cart-item"
                    key={item.id}
                  >
                    <h2>{item.name}</h2>

                    <p>
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <div className="quantity-controls">
                      <button
                        className="quantity-button"
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                      >
                        −
                      </button>

                      <strong>
                        {item.cartQuantity}
                      </strong>

                      <button
                        className="quantity-button"
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                      >
                        +
                      </button>

                      <button
                        className="danger-button"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="total">
                  Total: ₹
                  {cartTotal.toLocaleString(
                    "en-IN"
                  )}
                </div>

                <button
                  className="primary-button"
                  onClick={openCheckout}
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </section>
        )}

        {/* CHECKOUT */}

        {showCheckout && (
          <section className="checkout-section">
            <h1>Checkout</h1>

            <h2>Order Summary</h2>

            {cart.map((item) => (
              <p key={item.id}>
                {item.name} ×{" "}
                {item.cartQuantity} — ₹
                {(
                  item.price *
                  item.cartQuantity
                ).toLocaleString("en-IN")}
              </p>
            ))}

            <div className="total">
              Total: ₹
              {cartTotal.toLocaleString(
                "en-IN"
              )}
            </div>

            <h2>
              Customer Details
            </h2>

            <div className="form-group">
              <input
                className="form-input"
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <input
                className="form-input"
                type="email"
                placeholder="Customer Email"
                value={customerEmail}
                onChange={(e) =>
                  setCustomerEmail(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="primary-button"
              onClick={placeOrder}
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>

            <br />
            <br />

            <button
              className="secondary-button"
              onClick={() => {
                setShowCheckout(false);
                setShowCart(true);
              }}
            >
              Back to Cart
            </button>
          </section>
        )}

        {/* ORDERS */}

        {showOrders &&
          !selectedOrder && (
            <section className="orders-section">
              <h1>My Orders</h1>

              {ordersLoading ? (
                <div className="empty">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="empty">
                  <h2>
                    No orders found
                  </h2>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    className="order-card"
                    key={order.id}
                  >
                    <h2>
                      Order #{order.id}
                    </h2>

                    <p>
                      Customer:{" "}
                      {order.customerName}
                    </p>

                    <p>
                      Email:{" "}
                      {order.customerEmail}
                    </p>

                    <p>
                      Status:{" "}
                      <strong>
                        {order.status}
                      </strong>
                    </p>

                    <p>
                      Total: ₹
                      {Number(
                        order.totalPrice
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <div className="order-actions">
                      <button
                        className="secondary-button"
                        onClick={() =>
                          viewOrder(
                            order.id
                          )
                        }
                      >
                        View Details
                      </button>

                      {order.status !==
                        "CANCELLED" && (
                        <button
                          className="danger-button"
                          onClick={() =>
                            handleCancelOrder(
                              order.id
                            )
                          }
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              <br />

              <button
                className="secondary-button"
                onClick={() =>
                  setShowOrders(false)
                }
              >
                Back to Products
              </button>
            </section>
          )}

        {/* ORDER DETAILS */}

        {showOrders &&
          selectedOrder && (
            <section className="order-details">
              <h1>
                Order #
                {selectedOrder.id}
              </h1>

              <p>
                Customer:{" "}
                {selectedOrder.customerName}
              </p>

              <p>
                Email:{" "}
                {selectedOrder.customerEmail}
              </p>

              <p>
                Status:{" "}
                <strong>
                  {selectedOrder.status}
                </strong>
              </p>

              <p>
                Total: ₹
                {Number(
                  selectedOrder.totalPrice
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              <h2>
                Order Items
              </h2>

              {orderItems.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  <h3>
                    {item.productName}
                  </h3>

                  <p>
                    Price: ₹
                    {Number(
                      item.price
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      disabled={
                        item.quantity <= 1
                      }
                      onClick={() =>
                        updateItemQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <strong>
                      {item.quantity}
                    </strong>

                    <button
                      className="quantity-button"
                      onClick={() =>
                        updateItemQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              {selectedOrder.status !== "CANCELLED" && (
                <>
                  <button
                    className="secondary-button"
                    onClick={() =>
                      handleGenerateInvoice(selectedOrder.id)
                    }
                    disabled={invoiceLoading}
                  >
                    {invoiceLoading
                      ? "Generating Invoice..."
                      : "Generate Invoice"}
                  </button>

                  {invoice && (
                    <div className="invoice-box">
                      <h2>Invoice Generated</h2>

                      <p>
                        <strong>Invoice ID:</strong>{" "}
                        {invoice.invoiceId}
                      </p>

                      <p>
                        <strong>Order ID:</strong>{" "}
                        {invoice.orderId}
                      </p>

                      <p>
                        <strong>Customer:</strong>{" "}
                        {invoice.customerName}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {invoice.customerEmail}
                      </p>

                      <p>
                        <strong>Total Amount:</strong> ₹
                        {Number(
                          invoice.totalAmount
                        ).toLocaleString("en-IN")}
                      </p>

                      <p>
                        <strong>Status:</strong> Generated
                      </p>
                    </div>
                  )}
                </>
              )}

              <br />
              <br />

              <button
                className="secondary-button"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                Back to My Orders
              </button>
            </section>
          )}
      </main>
    </div>
  );
}

export default App;