// ======================================
// IK Agro Services - Cart System
// cart.js
// ======================================

const cartItemsContainer = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");

const cartCount = document.getElementById("cart-count");
const subtotal = document.getElementById("subtotal");
const grandTotal = document.getElementById("grand-total");

const clearCartBtn = document.querySelector(".clear-cart");

// ==============================
// Get Cart
// ==============================

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// ==============================
// Save Cart
// ==============================

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ==============================
// Format Currency
// ==============================

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

// ==============================
// Update Totals
// ==============================

function updateSummary(cart) {
  let total = 0;
  let items = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    items += item.quantity;
  });

  subtotal.textContent = formatPrice(total);
  grandTotal.textContent = formatPrice(total);
  cartCount.textContent = items;
}

// ==============================
// Render Cart
// ==============================

function renderCart() {
  const cart = getCart();

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    document.querySelector(".cart-wrapper").style.display = "none";
    emptyCart.style.display = "block";

    return;
  }

  document.querySelector(".cart-wrapper").style.display = "grid";
  emptyCart.style.display = "none";

  cart.forEach((item) => {
    const card = document.createElement("div");

    card.className = "cart-item";

    card.innerHTML = `
        
        <div class="product-image">

            <img src="${item.image}" alt="${item.name}">

        </div>

        <div class="product-details">

            <div class="product-top">

                <div>

                    <h3 class="product-name">${item.name}</h3>

                    <p class="product-category">
                        ${item.category || "Agricultural Product"}
                    </p>

                </div>

                <div class="product-price">

                    ${formatPrice(item.price)}

                </div>

            </div>

            <div class="product-bottom">

                <div class="quantity">

                    <button onclick="decreaseQuantity('${item.id}')">−</button>

                    <span>${item.quantity}</span>

                    <button onclick="increaseQuantity('${item.id}')">+</button>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeItem('${item.id}')">

                    <i class="fa-solid fa-trash"></i>

                    Remove

                </button>

            </div>

        </div>

        `;

    cartItemsContainer.appendChild(card);
  });

  updateSummary(cart);
}

// ==============================
// Increase Quantity
// ==============================

function increaseQuantity(id) {
  const cart = getCart();

  const product = cart.find((item) => item.id === id);

  if (!product) return;

  product.quantity++;

  saveCart(cart);

  renderCart();
}

// ==============================
// Decrease Quantity
// ==============================

function decreaseQuantity(id) {
  const cart = getCart();

  const product = cart.find((item) => item.id === id);

  if (!product) return;

  product.quantity--;

  if (product.quantity <= 0) {
    removeItem(id);

    return;
  }

  saveCart(cart);

  renderCart();
}

// ==============================
// Remove Item
// ==============================

function removeItem(id) {
  let cart = getCart();

  cart = cart.filter((item) => item.id !== id);

  saveCart(cart);

  renderCart();
}

// ==============================
// Clear Cart
// ==============================

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    if (!confirm("Clear all items from cart?")) return;

    localStorage.removeItem("cart");

    renderCart();
  });
}

// ==============================
// Checkout Button
// ==============================

const checkoutBtn = document.querySelector(".checkout-btn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
      alert("Your cart is empty.");

      return;
    }

    window.location.href = "checkout.html";
  });
}

// ==============================
// Initial Load
// ==============================

renderCart();
