// Server-side prices. Keep in sync with the PRODUCTS list in index.html. Amounts are in KES.
exports.PRICES = { w1:64500, w2:62000, w3:64500, w4:67000, w5:62000, h1:2500, h2:3500, h3:2000, h4:1500, h5:2500, h6:3000, h7:1000, h8:1200, h9:650, h10:4500, t1:45000 };
exports.CUSTOM = { base:30000, len:[0,5000,10000,17000,25000], tex:[0,2500,4000,5000], lace:[0,7500,13000,18000], den:[0,5000,10000,15000] };
exports.REVAMP = [4500, 7500, 9500, 14000, 11500];
exports.bundlePrice = (t, l) => (![0,1,2,3].includes(t) || !Number.isInteger(l) || l < 10 || l > 30 || l % 2) ? NaN : Math.round((3000 + (l - 10) * 1050) * [1,1.05,1.15,1.25][t] / 500) * 500;
const SPD = { 16: -12000, 20: -7000, 24: 0, 28: 8000 };
const ST = { s1:{base:64500}, s3:{base:67000}, s4:{base:64500}, s5:{base:64500}, s2:{tbl:{10:45000,12:47500,14:50000}}, s6:{tbl:{10:45000,12:47500,14:50000}} };
exports.stylePrice = (id, l) => { const s = ST[id]; if (!s) return NaN; const v = s.tbl ? s.tbl[l] : (SPD[l] === undefined ? NaN : s.base + SPD[l]); return v === undefined ? NaN : v; };
