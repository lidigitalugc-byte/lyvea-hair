const crypto = require("crypto");
const { PRICES, CUSTOM, REVAMP, bundlePrice, stylePrice, prePrice } = require("./_catalog");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { items, customer } = req.body || {};
  if (!Array.isArray(items) || !items.length || !customer || !customer.email)
    return res.status(400).json({ error: "Missing items or email" });

  // Recompute the total on the server so customers cannot change prices.
  let total = 0; const lines = [];
  for (const it of items) {
    const q = Math.max(1, Math.min(20, parseInt(it.q) || 1));
    let price;
    if (it.k === "custom" && Array.isArray(it.o)) {
      const [l, t, c, d] = it.o;
      price = (CUSTOM.base + CUSTOM.len[l] + CUSTOM.tex[t] + CUSTOM.lace[c] + CUSTOM.den[d]) / 2;
      lines.push("Custom wig deposit");
    } else if (it.k === "bundle" && Array.isArray(it.o)) {
      price = bundlePrice(it.o[0], it.o[1]); lines.push("Bundle " + it.o[0] + "/" + it.o[1] + "in x" + q);
    } else if (it.k === "style" && Array.isArray(it.o)) {
      price = stylePrice(it.o[0], it.o[1]); lines.push("Style " + it.o[0] + "/" + it.o[1] + "in x" + q);
    } else if (it.k === "pre" && Array.isArray(it.o)) {
      price = prePrice(it.o); lines.push("PRE-ORDER 70% deposit " + it.o.join("/"));
    } else if (it.k === "revamp") {
      price = REVAMP[it.o]; lines.push("Revamp");
    } else {
      price = PRICES[it.id]; lines.push(it.id + " x" + q);
    }
    if (!Number.isFinite(price)) return res.status(400).json({ error: "Unknown item" });
    total += price * q;
  }

  const r = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: customer.email,
      amount: Math.round(total * 100), // Paystack uses the smallest unit (cents)
      currency: "KES",
      reference: "LY" + crypto.randomBytes(5).toString("hex").toUpperCase(),
      callback_url: process.env.SITE_URL + "/",
      metadata: { name: customer.name, phone: customer.phone, address: customer.address, items: lines.join(", ") }
    })
  });
  const d = await r.json();
  if (!d.status) return res.status(502).json({ error: d.message || "Paystack error" });
  res.json({ url: d.data.authorization_url, reference: d.data.reference });
};
