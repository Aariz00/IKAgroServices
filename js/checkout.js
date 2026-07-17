function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}

// -----------------------------
// DOM Elements
// -----------------------------

const checkoutItems = document.getElementById("checkout-items");

const subtotalElement = document.getElementById("subtotal");

const taxElement = document.getElementById("tax");

const grandTotalElement = document.getElementById("grandTotal");

// -----------------------------
// Cart
// -----------------------------

const cart = getCart();

// -----------------------------
// Empty Cart
// -----------------------------

if (cart.length === 0) {
  alert("Your cart is empty.");

  window.location.href = "cart.html";
}

// -----------------------------
// Render Checkout Items
// -----------------------------

function renderCheckoutItems() {
  checkoutItems.innerHTML = "";

  cart.forEach((item) => {
    const div = document.createElement("div");

    div.className = "checkout-item";

    div.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}">

            <div class="checkout-item-info">

                <h4>${item.name}</h4>

                <p>${item.category}</p>

                <p>

                    Quantity :

                    <strong>${item.quantity}</strong>

                </p>

            </div>

            <div class="checkout-item-price">

                ${formatPrice(item.price * item.quantity)}

            </div>

        `;

    checkoutItems.appendChild(div);
  });
}

// -----------------------------
// Totals
// -----------------------------

function calculateTotals() {
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const shipping = 0;

  const tax = 0;

  const grandTotal = subtotal + shipping + tax;

  subtotalElement.textContent = formatPrice(subtotal);

  taxElement.textContent = formatPrice(tax);

  grandTotalElement.textContent = formatPrice(grandTotal);

  return {
    subtotal,

    shipping,

    tax,

    grandTotal,
  };
}

// -----------------------------
// Order Object
// -----------------------------

function buildOrderObject(formData) {
  const totals = calculateTotals();

  return {
    orderId: "IK-" + Date.now(),

    createdAt: new Date().toISOString(),

    customer: formData,

    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),

    pricing: totals,

    status: "Pending",
  };
}

// -----------------------------
// Initial Load
// -----------------------------

renderCheckoutItems();

calculateTotals();

const checkoutForm = document.getElementById("checkoutForm");

const checkoutBtn = document.getElementById("checkoutBtn");

// -----------------------------
// Helpers
// -----------------------------

function showError(id, message) {
  const input = document.getElementById(id);

  const error = document.getElementById(id + "Error");

  if (!input || !error) return;

  input.classList.add("error");
  input.classList.remove("success");

  error.textContent = message;
  error.style.display = "block";
}

function clearError(id) {
  const input = document.getElementById(id);

  const error = document.getElementById(id + "Error");

  if (!input || !error) return;

  input.classList.remove("error");
  input.classList.add("success");

  error.textContent = "";
  error.style.display = "none";
}

// -----------------------------
// Validation
// -----------------------------

function validateForm() {
  let valid = true;

  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "country",
    "state",
    "city",
    "zip",
    "address",
    "fullAddress",
  ];

  requiredFields.forEach((id) => {
    const input = document.getElementById(id);

    if (!input) return;

    if (input.value.trim() === "") {
      showError(id, "This field is required");

      valid = false;
    } else {
      clearError(id);
    }
  });

  // Email

  const email = document.getElementById("email").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showError("email", "Enter a valid email");

    valid = false;
  }

  // Phone

  const phone = document.getElementById("phone").value.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    showError("phone", "Enter a valid 10 digit number");

    valid = false;
  }

  return valid;
}

// -----------------------------
// Customer Data
// -----------------------------

function collectCustomerData() {
  return {
    fullName: document.getElementById("fullName").value.trim(),

    email: document.getElementById("email").value.trim(),

    phone: document.getElementById("phone").value.trim(),

    company: document.getElementById("company").value.trim(),

    country: document.getElementById("country").value,

    state: document.getElementById("state").value.trim(),

    city: document.getElementById("city").value.trim(),

    zip: document.getElementById("zip").value.trim(),

    address: document.getElementById("address").value.trim(),

    fullAddress: document.getElementById("fullAddress").value.trim(),

    notes: document.getElementById("notes").value.trim(),
  };
}

// -----------------------------
// Submit
// -----------------------------

checkoutForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  checkoutBtn.classList.add("loading");

  checkoutBtn.disabled = true;

  const customer = collectCustomerData();

  const order = buildOrderObject(customer);

  // Save latest order

  localStorage.setItem(
    "latestOrder",

    JSON.stringify(order),
  );

  setTimeout(() => {
    checkoutBtn.classList.remove("loading");

    checkoutBtn.disabled = false;

    completeOrder(order);
  }, 1500);
});

function completeOrder(order) {
  // Save Order History

  const orderHistory = JSON.parse(localStorage.getItem("orders")) || [];

  orderHistory.push(order);

  localStorage.setItem("orders", JSON.stringify(orderHistory));

  // Save Latest Order

  localStorage.setItem("latestOrder", JSON.stringify(order));

  // Clear Cart

  localStorage.removeItem("cart");

  // Reset Cart Badge

  const badge = document.getElementById("cart-count");

  if (badge) {
    badge.textContent = "0";
  }

  // Redirect

  window.location.href = "success.html";
}

// -----------------------------
// Replace Submit Timeout
// -----------------------------

// Replace ONLY the setTimeout()
// inside Part 2 with this one.

setTimeout(() => {
  checkoutBtn.classList.remove("loading");

  checkoutBtn.disabled = false;

  completeOrder(order);
}, 1500);

// -----------------------------
// Auto Fill (Optional)
// -----------------------------

const savedCustomer = JSON.parse(localStorage.getItem("customer"));

if (savedCustomer) {
  Object.keys(savedCustomer).forEach((key) => {
    const field = document.getElementById(key);

    if (field) {
      field.value = savedCustomer[key];
    }
  });
}

// -----------------------------
// Save Customer Draft
// -----------------------------

checkoutForm.querySelectorAll("input, textarea, select").forEach((field) => {
  field.addEventListener("change", () => {
    const customer = collectCustomerData();

    localStorage.setItem("customer", JSON.stringify(customer));
  });
});
