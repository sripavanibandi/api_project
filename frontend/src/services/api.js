const API_KEY = "ecommerce-secret-key";

async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {}),
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const raw = await response.text();
    let message = raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        message = parsed.error || parsed.message || raw;
      }
    } catch (_) {
      // not JSON
    }

    if (!message || message.trim() === "") {
      if (response.status === 429) {
        message = "Too many requests. Please wait a moment and try again.";
      } else if (response.status === 401) {
        message = "Authentication required or session expired. Please log in again.";
      } else if (response.status === 404) {
        message = "Order or resource not found.";
      } else {
        message = `Request failed (HTTP ${response.status})`;
      }
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getProducts() {
  return request("/products");
}

export async function createOrder(customerName, customerEmail, deliveryAddress = "", deliveryPhone = "") {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify({
      customerName,
      customerEmail,
      status: "CONFIRMED",
      totalPrice: 0,
      deliveryAddress,
      deliveryPhone
    })
  });
}

export async function addOrderItem(item) {
  return request("/orders/items", {
    method: "POST",
    body: JSON.stringify(item)
  });
}

export async function getOrders() {
  return request("/orders");
}

export async function getOrder(orderId) {
  return request(`/orders/${orderId}`);
}

export async function getOrderItems(orderId) {
  return request(`/orders/${orderId}/items`);
}

export async function cancelOrder(orderId) {
  return request(`/orders/${orderId}`, {
    method: "DELETE"
  });
}

export async function updateOrderItemQuantity(itemId, quantity) {
  return request(
    `/orders/items/${itemId}/quantity?quantity=${quantity}`,
    {
      method: "PUT"
    }
  );
}

export async function generateInvoice(orderId) {
  return request(`/orders/${orderId}/invoice`);
}

export async function registerUser(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password
    })
  });
}

export async function loginUser(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });
}