// ==========================================
// IK Agro Services
// products.js
// ==========================================

// -------------------------
// Get Cart
// -------------------------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// -------------------------
// Save Cart
// -------------------------

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// -------------------------
// Update Cart Badge
// -------------------------

function updateCartBadge() {
  const badge = document.getElementById("cart-count");

  if (!badge) return;

  const cart = getCart();

  let totalItems = 0;

  cart.forEach((item) => {
    totalItems += item.quantity;
  });

  badge.textContent = totalItems;
}

// -------------------------
// Add Product
// -------------------------

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);

  updateCartBadge();

  showToast(`${product.name} added to cart`);
}

// -------------------------
// Button Click
// -------------------------

document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const product = {
      id: this.dataset.id,

      name: this.dataset.name,

      category: this.dataset.category,

      price: Number(this.dataset.price),

      image: this.dataset.image,
    };

    addToCart(product);
  });
});

// -------------------------
// Toast
// -------------------------

function showToast(message) {
  let toast = document.getElementById("cart-toast");

  if (!toast) {
    toast = document.createElement("div");

    toast.id = "cart-toast";

    toast.style.position = "fixed";
    toast.style.top = "30px";
    toast.style.right = "30px";
    toast.style.background = "#2E7D32";
    toast.style.color = "#fff";
    toast.style.padding = "16px 22px";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 10px 30px rgba(0,0,0,.15)";
    toast.style.zIndex = "9999";
    toast.style.fontFamily = "Poppins";
    toast.style.transition = ".35s";
    toast.style.opacity = "0";

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2500);
}

// -------------------------
// Initial Badge Update
// -------------------------

updateCartBadge();
