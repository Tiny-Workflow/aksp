"use strict";

const MENU = Object.freeze({
  "Chilli Potato": 40,
  "White Sauce Pasta": 40,
  "Cold Coffee": 30,
  "Chip Chaat": 30,
  "Chocolates": 10,
  "Chocolate Wafers": 10,
  "Cookies": 40
});

const CART_KEY = "aao-kabhi-stall-pe-cart-v1";

function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "{}");

    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      return {};
    }

    const clean = {};

    for (const [item, quantity] of Object.entries(saved)) {
      if (
        Object.hasOwn(MENU, item) &&
        Number.isSafeInteger(quantity) &&
        quantity > 0 &&
        quantity <= 999
      ) {
        clean[item] = quantity;
      }
    }

    return clean;
  } catch {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    return true;
  } catch {
    showToast("Browser storage unavailable. Please check your browser settings.");
    return false;
  }
}

function addToCart(item) {
  if (!Object.hasOwn(MENU, item)) return;

  const cart = getCart();

  if ((cart[item] || 0) >= 999) {
    showToast("That's a lot! Maximum quantity reached.");
    return;
  }

  cart[item] = (cart[item] || 0) + 1;

  if (saveCart(cart)) {
    renderCart();
    showToast(item + " added to your plate! ✨");
  }
}

function changeQuantity(item, change) {
  if (!Object.hasOwn(MENU, item)) return;

  const cart = getCart();
  const next = (cart[item] || 0) + change;

  if (next <= 0) {
    delete cart[item];
  } else if (next <= 999) {
    cart[item] = next;
  }

  if (saveCart(cart)) {
    renderCart();
  }
}

function removeItem(item) {
  const cart = getCart();
  delete cart[item];

  if (saveCart(cart)) {
    renderCart();
    showToast(item + " removed.");
  }
}

function clearCart() {
  if (!window.confirm("Clear all items from your plate?")) return;

  if (saveCart({})) {
    renderCart();
    showToast("Your plate is empty now.");
  }
}

function updateCartCount() {
  const cart = getCart();

  const count = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.hidden = false;

  if (window.toastTimer) {
    clearTimeout(window.toastTimer);
  }

  window.toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function createCartRow(item, quantity) {
  const row = createElement("article", "cart-row");

  const details = createElement("div", "cart-item-details");
  const name = createElement("div", "cart-item-name", item);
  const unitPrice = createElement(
    "div",
    "cart-item-price",
    `₹${MENU[item]} each`
  );

  details.append(name, unitPrice);

  const subtotal = createElement(
    "div",
    "cart-subtotal",
    `₹${MENU[item] * quantity}`
  );

  const controls = createElement("div", "quantity-controls");

  const minus = createElement("button", "quantity-button", "−");
  minus.type = "button";
  minus.setAttribute("aria-label", `Remove one ${item}`);
  minus.addEventListener("click", () => changeQuantity(item, -1));

  const number = createElement("span", "quantity-value", String(quantity));

  const plus = createElement("button", "quantity-button", "+");
  plus.type = "button";
  plus.setAttribute("aria-label", `Add one ${item}`);
  plus.disabled = quantity >= 999;
  plus.addEventListener("click", () => changeQuantity(item, 1));

  const remove = createElement("button", "remove-button", "Remove item");
  remove.type = "button";
  remove.addEventListener("click", () => removeItem(item));

  controls.append(minus, number, plus, remove);
  row.append(details, subtotal, controls);

  return row;
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  const emptyMessage = document.getElementById("cart-empty");
  const summary = document.getElementById("cart-summary");

  if (!container || !totalElement) return;

  const cart = getCart();
  const entries = Object.entries(cart);
  const isEmpty = entries.length === 0;

  container.replaceChildren();

  if (emptyMessage) {
    emptyMessage.hidden = !isEmpty;
  }

  if (summary) {
    summary.hidden = isEmpty;
  }

  let total = 0;

  for (const [item, quantity] of entries) {
    total += MENU[item] * quantity;
    container.appendChild(createCartRow(item, quantity));
  }

  totalElement.textContent = `₹${total}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  document.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.add);
    });
  });

  const clearButton = document.getElementById("clear-cart");

  if (clearButton) {
    clearButton.addEventListener("click", clearCart);
  }
});