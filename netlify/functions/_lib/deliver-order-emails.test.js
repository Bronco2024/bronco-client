/**
 * Lightweight sanity checks for order email delivery helpers.
 * Run with: node netlify/functions/_lib/deliver-order-emails.test.js
 */
const assert = require("assert");

process.env.SITE_URL = "https://petzo.co.il";

const {
  buildBuyerOrderEmail,
  buildAdminOrderEmail,
  ADMIN_EMAIL,
} = require("./order-emails");

const order = {
  email: "buyer@example.com",
  totalPrice: 120,
  totalQuantity: 2,
  paymentMethod: "cod",
  status: "pending",
  contactDetails: {
    firstName: "רולה",
    lastName: "ק",
    phone: "0500000000",
    city: "נצרת",
    address: "רחוב 1",
  },
  items: [{ title: "מזון", price: 60, quantity: 2 }],
};

const buyer = buildBuyerOrderEmail({ orderId: "ord1", order });
const admin = buildAdminOrderEmail({ orderId: "ord1", order });

assert.strictEqual(buyer.to, "buyer@example.com");
assert.ok(buyer.subject.includes("אישור הזמנה"));
assert.ok(buyer.text.includes("מזון"));
assert.strictEqual(admin.to, ADMIN_EMAIL);
assert.ok(admin.subject.includes("הזמנה חדשה"));
assert.ok(admin.text.includes("נצרת"));

console.log("deliver-order-emails helpers ok");
