/* ==========================================================
   checkout.js
   Part 1
   ----------------------------------------------------------
   - Product Catalog
   - Storage Service
   - Utility Functions
   - DOM References
   - Load Selected Product
   ========================================================== */

/* ==========================================================
   PRODUCT CATALOG
   ========================================================== */

const PRODUCTS = {
  P001: {
    id: "P001",
    name: "Agricultural Consulting Package",
    price: 2500,
    tax: 0,
    image: "🌾",
  },

  P002: {
    id: "P002",
    name: "Export Consultation Package",
    price: 2000,
    tax: 0,
    image: "🚢",
  },

  P003: {
    id: "P003",
    name: "Crop Management Plan",
    price: 1500,
    tax: 0,
    image: "🌱",
  },

  P004: {
    id: "P004",
    name: "Complete Agro Business Package",
    price: 5000,
    tax: 0,
    image: "🏆",
  },
};

/* ==========================================================
   STORAGE SERVICE
   ========================================================== */

const StorageService = {
  selectedProductKey: "selectedProduct",

  latestOrderKey: "latestOrder",

  ordersKey: "orders",

  getSelectedProduct() {
    const product = sessionStorage.getItem(this.selectedProductKey);

    return product ? JSON.parse(product) : null;
  },

  saveOrder(order) {
    localStorage.setItem(this.latestOrderKey, JSON.stringify(order));

    const orders = JSON.parse(localStorage.getItem(this.ordersKey)) || [];

    orders.push(order);

    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
  },

  getLatestOrder() {
    return JSON.parse(localStorage.getItem(this.latestOrderKey));
  },

  clearSelectedProduct() {
    sessionStorage.removeItem(this.selectedProductKey);
  },
};

/* ==========================================================
   DOM ELEMENTS
   ========================================================== */

const form = document.getElementById("checkoutForm");

const checkoutBtn = document.getElementById("checkoutBtn");

const productName = document.getElementById("productName");

const productId = document.getElementById("productId");

const productPrice = document.getElementById("productPrice");

const taxAmount = document.getElementById("taxAmount");

const totalAmount = document.getElementById("totalAmount");

const productImage = document.getElementById("productImage");

/* ==========================================================
   UTILITIES
   ========================================================== */

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",

    currency: "USD",
  }).format(value);
}

function generateOrderId() {
  const date = new Date();

  const today =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let random = "";

  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `AGR-${today}-${random}`;
}

/* ==========================================================
   PRODUCT LOADER
   ========================================================== */

function loadSelectedProduct() {
  const selected = StorageService.getSelectedProduct();

  if (!selected || !selected.productId) {
    alert("No product selected.");

    window.location.href = "index.html";

    return;
  }

  const product = PRODUCTS[selected.productId];

  if (!product) {
    alert("Product not found.");

    window.location.href = "index.html";

    return;
  }

  productName.textContent = product.name;

  productId.textContent = product.id;

  productPrice.textContent = formatCurrency(product.price);

  taxAmount.textContent = formatCurrency(product.tax);

  totalAmount.textContent = formatCurrency(product.price + product.tax);

  productImage.textContent = product.image;

  return product;
}

/* ==========================================================
   CURRENT PRODUCT
   ========================================================== */

const CURRENT_PRODUCT = loadSelectedProduct();
/* ==========================================================
   VALIDATION
========================================================== */

const fields = {
  fullName: document.getElementById("fullName"),

  email: document.getElementById("email"),

  phone: document.getElementById("phone"),

  company: document.getElementById("company"),

  country: document.getElementById("country"),

  state: document.getElementById("state"),

  city: document.getElementById("city"),

  zip: document.getElementById("zip"),

  address: document.getElementById("address"),

  notes: document.getElementById("notes"),
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX = /^[0-9]{10,15}$/;

function showError(input, message) {
  input.classList.remove("success");

  input.classList.add("error");

  const error = document.getElementById(input.id + "Error");

  if (!error) return;

  error.textContent = message;

  error.style.display = "block";
}

function clearError(input) {
  input.classList.remove("error");

  input.classList.add("success");

  const error = document.getElementById(input.id + "Error");

  if (!error) return;

  error.textContent = "";

  error.style.display = "none";
}

function isEmpty(value) {
  return value.trim() === "";
}

function validateRequired(input, message) {
  if (isEmpty(input.value)) {
    showError(input, message);

    return false;
  }

  clearError(input);

  return true;
}

function validateEmail() {
  const value = fields.email.value.trim();

  if (value === "") {
    showError(
      fields.email,

      "Email is required.",
    );

    return false;
  }

  if (!EMAIL_REGEX.test(value)) {
    showError(
      fields.email,

      "Please enter a valid email.",
    );

    return false;
  }

  clearError(fields.email);

  return true;
}

function validatePhone() {
  const value = fields.phone.value.replace(/\D/g, "");

  if (value.length === 0) {
    showError(
      fields.phone,

      "Phone number is required.",
    );

    return false;
  }

  if (!PHONE_REGEX.test(value)) {
    showError(
      fields.phone,

      "Enter a valid phone number.",
    );

    return false;
  }

  clearError(fields.phone);

  return true;
}

function validateZip() {
  const value = fields.zip.value.trim();

  if (value === "") {
    showError(
      fields.zip,

      "ZIP Code is required.",
    );

    return false;
  }

  if (value.length < 4) {
    showError(
      fields.zip,

      "Invalid ZIP Code.",
    );

    return false;
  }

  clearError(fields.zip);

  return true;
}

function validateName() {
  const value = fields.fullName.value.trim();

  if (value.length < 3) {
    showError(
      fields.fullName,

      "Enter your full name.",
    );

    return false;
  }

  clearError(fields.fullName);

  return true;
}

function validateForm() {
  let valid = true;

  if (!validateName()) valid = false;

  if (!validateEmail()) valid = false;

  if (!validatePhone()) valid = false;

  if (!validateZip()) valid = false;

  if (!validateRequired(fields.country, "Country is required.")) valid = false;

  if (!validateRequired(fields.state, "State is required.")) valid = false;

  if (!validateRequired(fields.city, "City is required.")) valid = false;

  if (!validateRequired(fields.address, "Address is required.")) valid = false;

  return valid;
}

/* ==========================================================
   LIVE VALIDATION
========================================================== */

fields.fullName.addEventListener(
  "input",

  validateName,
);

fields.email.addEventListener(
  "input",

  validateEmail,
);

fields.phone.addEventListener(
  "input",

  validatePhone,
);

fields.zip.addEventListener(
  "input",

  validateZip,
);

fields.country.addEventListener(
  "change",

  () =>
    validateRequired(
      fields.country,

      "Country is required.",
    ),
);

fields.state.addEventListener(
  "input",

  () =>
    validateRequired(
      fields.state,

      "State is required.",
    ),
);

fields.city.addEventListener(
  "input",

  () =>
    validateRequired(
      fields.city,

      "City is required.",
    ),
);

fields.address.addEventListener(
  "input",

  () =>
    validateRequired(
      fields.address,

      "Address is required.",
    ),
);
/* ==========================================================
   SUBMIT ORDER
========================================================== */

function setLoading(isLoading) {
  if (isLoading) {
    checkoutBtn.classList.add("loading");

    checkoutBtn.disabled = true;

    checkoutBtn.querySelector("span").textContent = "Processing Order...";
  } else {
    checkoutBtn.classList.remove("loading");

    checkoutBtn.disabled = false;

    checkoutBtn.querySelector("span").textContent = "Complete Order";
  }
}

/* ==========================================================
   CREATE ORDER OBJECT
========================================================== */

function createOrder() {
  return {
    orderId: generateOrderId(),

    createdAt: new Date().toISOString(),

    status: "Order Received",

    paymentStatus: "Pending",

    customer: {
      fullName: fields.fullName.value.trim(),

      email: fields.email.value.trim(),

      phone: fields.phone.value.trim(),

      company: fields.company.value.trim(),

      address: {
        country: fields.country.value,

        state: fields.state.value.trim(),

        city: fields.city.value.trim(),

        zip: fields.zip.value.trim(),

        street: fields.address.value.trim(),
      },

      notes: fields.notes.value.trim(),
    },

    items: [
      {
        productId: CURRENT_PRODUCT.id,

        productName: CURRENT_PRODUCT.name,

        quantity: 1,

        price: CURRENT_PRODUCT.price,
      },
    ],

    pricing: {
      subtotal: CURRENT_PRODUCT.price,

      tax: CURRENT_PRODUCT.tax,

      total: CURRENT_PRODUCT.price + CURRENT_PRODUCT.tax,
    },
  };
}

/* ==========================================================
   SAVE ORDER
========================================================== */

function saveOrder(order) {
  StorageService.saveOrder(order);
}

/* ==========================================================
   REDIRECT
========================================================== */

function redirectToSuccess() {
  window.location.href = "success.html";
}

/* ==========================================================
   FORM SUBMIT
========================================================== */

form.addEventListener(
  "submit",

  function (event) {
    event.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector(".error");

      if (firstError) {
        firstError.focus();
      }

      return;
    }

    setLoading(true);

    setTimeout(() => {
      const order = createOrder();

      saveOrder(order);

      StorageService.clearSelectedProduct();

      redirectToSuccess();
    }, 1200);
  },
);

/* ==========================================================
   PREVENT DOUBLE SUBMIT
========================================================== */

window.addEventListener(
  "pageshow",

  () => {
    setLoading(false);
  },
);

