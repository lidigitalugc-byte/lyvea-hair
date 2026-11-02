module.exports = async (req, res) => {
  const ref = req.query.reference;
  if (!ref) return res.status(400).json({ error: "No reference" });
  const r = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref), {
    headers: { Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY }
  });
  const d = await r.json();
  res.json({ paid: !!(d.status && d.data && d.data.status === "success"), reference: ref });
};
