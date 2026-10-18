const PRODUCTS = [
  // FOOD & DRINKS
  {
    id: "chilli-potato",
    name: "Chilli Potato",
    price: 40,
    category: "Food & Drinks",
    emoji: "🍟"
  },
  {
    id: "white-sauce-pasta",
    name: "White Sauce Pasta",
    price: 40,
    category: "Food & Drinks",
    emoji: "🍝"
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    price: 30,
    category: "Food & Drinks",
    emoji: "☕"
  },
  {
    id: "chip-chaat",
    name: "Chip Chaat",
    price: 30,
    category: "Food & Drinks",
    emoji: "🥔"
  },
  {
    id: "chocolates",
    name: "Chocolates",
    price: 10,
    category: "Food & Drinks",
    emoji: "🍫"
  },
  {
    id: "chocolate-wafers",
    name: "Chocolate Wafers",
    price: 10,
    category: "Food & Drinks",
    emoji: "🍫"
  },
  {
    id: "cookies",
    name: "Cookies",
    price: 40,
    category: "Food & Drinks",
    emoji: "🍪"
  },

  // ACCESSORIES & GIFTS
  {
    id: "minecraft-keychain",
    name: "Minecraft Keychain",
    price: 120,
    category: "Accessories & Gifts",
    emoji: "⛏️"
  },
  {
    id: "car-keychain",
    name: "Car Keychain",
    price: 50,
    category: "Accessories & Gifts",
    emoji: "🚗"
  },
  {
    id: "camera-keychain",
    name: "Camera Keychain",
    price: 100,
    category: "Accessories & Gifts",
    emoji: "📷"
  },
  {
    id: "coffee-cup-keychain",
    name: "Coffee Cup Keychain",
    price: 120,
    category: "Accessories & Gifts",
    emoji: "☕"
  },
  {
    id: "tom-jerry-keychain",
    name: "Tom and Jerry Keychain",
    price: 90,
    category: "Accessories & Gifts",
    emoji: "🐱"
  },
  {
    id: "earring-set",
    name: "4-Piece Earring Set",
    price: 220,
    category: "Accessories & Gifts",
    emoji: "💎"
  },
  {
    id: "toy",
    name: "Toy",
    price: 120,
    category: "Accessories & Gifts",
    emoji: "🧸"
  },
  {
    id: "hair-clip",
    name: "Hair Clip",
    price: 110,
    category: "Accessories & Gifts",
    emoji: "🎀"
  },
  {
    id: "star-pendant",
    name: "Star-Shaped Pendant",
    price: 170,
    category: "Accessories & Gifts",
    emoji: "⭐"
  },
  {
    id: "bracelet",
    name: "Bracelet",
    price: 110,
    category: "Accessories & Gifts",
    emoji: "📿"
  },
  {
    id: "simple-pendant",
    name: "Simple Pendant",
    price: 120,
    category: "Accessories & Gifts",
    emoji: "✨"
  },
  {
    id: "clutcher-set",
    name: "4-Piece Clutcher Set",
    price: 300,
    category: "Accessories & Gifts",
    emoji: "🎀"
  }
];

const CART_KEY = "aao-kabhi-stall-pe-cart-v1";

let activeCategory = "All";
let toastTimeout;

function formatPrice(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function getCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));

    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      return {};
    }

    const cleanCart = {};

    for (const [id, quantity] of Object.entries(saved)) {
      if (
        PRODUCTS.some(product => product.id === id) &&
        Number.isInteger(quantity) &&
        quantity > 0
      ) {
        cleanCart[id] = quantity;
      }
    }

    return cleanCart;
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function getCartQuantity(cart = getCart()) {
  return Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );
}

function getCartTotal(cart = getCart()) {
  return PRODUCTS.reduce(
    (total, product) =>
      total + product.price * (cart[product.id] || 0),
    0
  );
}

function updateCartCount() {
  const count = getCartQuantity();

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
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addToCart(id) {
  const product = PRODUCTS.find(item => item.id === id);

  if (!product) return;

  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;

  saveCart(cart);
  showToast(`${product.name} added to your cart! 🛒`);

  // Update the quantity displayed on the product button.
  const card = document.querySelector(
    `[data-product-id="${id}"]`
  );

  if (card) {
    const button = card.querySelector(".add-button");

    if (button) {
      button.textContent = "Added ✓";
      setTimeout(() => {
        if (button.isConnected) {
          button.textContent = "Add to Cart +";
        }
      }, 900);
    }
  }
}

function setCategory(category) {
  activeCategory = category;

  document.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.category === category
    );
  });

  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const visibleProducts = activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter(
        product => product.category === activeCategory
      );

  const title = document.getElementById("catalogue-title");
  const count = document.getElementById("product-count");

  if (title) {
    title.textContent = activeCategory === "All"
      ? "All Products"
      : activeCategory;
  }

  if (count) {
    count.textContent =
      `${visibleProducts.length} products`;
  }

  if (visibleProducts.length === 0) {
    grid.innerHTML = "<p>No products found in this category.</p>";
    return;
  }

  grid.innerHTML = visibleProducts.map(product => `
    <article class="product-card"
      data-product-id="${product.id}">

      <div class="product-art" aria-hidden="true">
        ${product.emoji}
      </div>

      <span class="product-category">
        ${product.category}
      </span>

      <h3>${product.name}</h3>

      <div class="product-bottom">
        <span class="product-price">
          ${formatPrice(product.price)}
        </span>

        <button
          class="add-button"
          type="button"
          data-add="${product.id}">
          Add to Cart +
        </button>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();

  const items = PRODUCTS.filter(
    product => (cart[product.id] || 0) > 0
  );

  const quantityElement = document.getElementById(
    "summary-quantity"
  );

  const totalElement = document.getElementById("cart-total");

  if (quantityElement) {
    quantityElement.textContent = getCartQuantity(cart);
  }

  if (totalElement) {
    totalElement.textContent = formatPrice(getCartTotal(cart));
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">🛍️</div>
        <h3>Your cart is empty!</h3>
        <p>Go find something yummy or something cute.</p>
        <a class="button" href="menu.html">
          Explore Products →
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(product => {
    const quantity = cart[product.id];
    const subtotal = product.price * quantity;

    return `
      <article class="cart-row">
        <div class="cart-product-emoji" aria-hidden="true">
          ${product.emoji}
        </div>

        <div>
          <div class="cart-product-name">
            ${product.name}
          </div>

          <div class="cart-product-price">
            ${formatPrice(product.price)} each
          </div>

          <div class="quantity-control">
            <button
              type="button"
              data-cart-action="decrease"
              data-id="${product.id}"
              aria-label="Decrease ${product.name} quantity">
              −
            </button>

            <span>${quantity}</span>

            <button
              type="button"
              data-cart-action="increase"
              data-id="${product.id}"
              aria-label="Increase ${product.name} quantity">
              +
            </button>
          </div>
        </div>

        <div class="cart-line-total">
          ${formatPrice(subtotal)}
          <button
            class="remove-button"
            type="button"
            data-cart-action="remove"
            data-id="${product.id}">
            Remove
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function changeQuantity(id, change) {
  const cart = getCart();

  if (!PRODUCTS.some(product => product.id === id)) return;

  const newQuantity = (cart[id] || 0) + change;

  if (newQuantity <= 0) {
    delete cart[id];
  } else {
    cart[id] = newQuantity;
  }

  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  const cart = getCart();
  delete cart[id];

  saveCart(cart);
  renderCart();
  showToast("Item removed from cart.");
}

function clearCart() {
  const cart = getCart();

  if (getCartQuantity(cart) === 0) {
    showToast("Your cart is already empty!");
    return;
  }

  if (!confirm("Clear all items from your cart?")) return;

  saveCart({});
  renderCart();
  showToast("Cart cleared.");
}

function initialiseMenu() {
  const filterContainer = document.getElementById(
    "category-filters"
  );

  if (!filterContainer) return;

  filterContainer.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    setCategory(button.dataset.category);
  });

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");

  const validCategories = [
    "Food & Drinks",
    "Accessories & Gifts"
  ];

  if (validCategories.includes(requestedCategory)) {
    setCategory(requestedCategory);
  } else {
    setCategory("All");
  }

  // Support browser back/forward navigation between filters.
  window.addEventListener("popstate", () => {
    const category = new URLSearchParams(
      window.location.search
    ).get("category");

    setCategory(
      validCategories.includes(category) ? category : "All"
    );
  });
}

function initialiseCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.cartAction;

    if (action === "increase") changeQuantity(id, 1);
    if (action === "decrease") changeQuantity(id, -1);
    if (action === "remove") removeItem(id);
  });

  document.getElementById("clear-cart")
    ?.addEventListener("click", clearCart);

  document.getElementById("checkout-button")
    ?.addEventListener("click", () => {
      const cart = getCart();

      if (getCartQuantity(cart) === 0) {
        showToast("Add something to your cart first!");
        return;
      }

      alert(
        "Your cart has " +
        getCartQuantity(cart) +
        " item(s).\n\nGrand Total: " +
        formatPrice(getCartTotal(cart)) +
        "\n\nThis is a cart preview, not a completed order."
      );
    });

  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initialiseMenu();
  initialiseCart();

  // Allow adding products on any page that has product buttons.
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    addToCart(button.dataset.add);
  });
});
