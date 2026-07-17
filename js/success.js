// ===============================================
// IK Agro Services
// success.js
// Part 1
// ===============================================

// -----------------------------
// DOM Elements
// -----------------------------

const customerName = document.getElementById("customerName");
const orderId = document.getElementById("orderId");
const orderProducts = document.getElementById("orderProducts");
const totalQuantity = document.getElementById("totalQuantity");
const orderAmount = document.getElementById("orderAmount");
const paymentStatus = document.getElementById("paymentStatus");
const orderDate = document.getElementById("orderDate");

// -----------------------------
// Helpers
// -----------------------------

function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {

        day: "2-digit",
        month: "long",
        year: "numeric",

        hour: "2-digit",
        minute: "2-digit"

    });

}

// -----------------------------
// Load Latest Order
// -----------------------------

const latestOrder = JSON.parse(
    localStorage.getItem("latestOrder")
);

// -----------------------------
// No Order Found
// -----------------------------

if (!latestOrder) {

    alert("No recent order found.");

    window.location.href = "index.html";

}

// -----------------------------
// Customer Details
// -----------------------------

customerName.textContent =
latestOrder.customer.fullName;

orderId.textContent =
latestOrder.orderId;

paymentStatus.textContent =
latestOrder.status;

orderDate.textContent =
formatDate(latestOrder.createdAt);

// -----------------------------
// Products
// -----------------------------

let quantity = 0;

orderProducts.innerHTML = "";

latestOrder.items.forEach(item => {

    quantity += item.quantity;

    const div = document.createElement("div");

    div.className = "product-line";

    div.innerHTML = `

        <span>

            ${item.name}

        </span>

        <small>

            × ${item.quantity}

        </small>

    `;

    orderProducts.appendChild(div);

});

// -----------------------------
// Totals
// -----------------------------

totalQuantity.textContent = quantity;

orderAmount.textContent =
formatPrice(
    latestOrder.pricing.grandTotal
);
// ===============================================
// UI Enhancements
// ===============================================

// Payment Status Color

if (paymentStatus.textContent === "Pending") {

    paymentStatus.style.color = "#E67E22";

}
else if (paymentStatus.textContent === "Paid") {

    paymentStatus.style.color = "#16A34A";

}
else {

    paymentStatus.style.color = "#DC2626";

}

// ----------------------------
// Empty Product Fallback
// ----------------------------

if (latestOrder.items.length === 0) {

    orderProducts.innerHTML = `

        <div class="product-line">

            <span>No Products</span>

        </div>

    `;

}

// ----------------------------
// Console Log
// ----------------------------

console.log("Order Loaded");

console.log(latestOrder);