const crypto = require("crypto");
// Paystack calls this when a payment succeeds, even if the customer closes the page.
module.exports = async (req, res) => {
  const sig = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest("hex");
  if (sig !== req.headers["x-paystack-signature"]) return res.status(401).end();

  if (req.body.event === "charge.success") {
    const t = req.body.data, m = t.metadata || {};
    const r = await fetch(process.env.SUPABASE_URL + "/rest/v1/orders?on_conflict=reference", {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: "Bearer " + process.env.SUPABASE_SERVICE_KEY,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        reference: t.reference, name: m.name, email: t.customer && t.customer.email,
        phone: m.phone, address: m.address, items: m.items, amount_kes: t.amount / 100, status: "paid"
      })
    });
    // Returning an error makes Paystack retry the webhook later.
    if (!r.ok) { console.error("Supabase insert failed", r.status, await r.text()); return res.status(500).end(); }
  }
  res.status(200).end();
};
