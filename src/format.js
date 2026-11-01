const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inrShort = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const pad = (n) => String(n).padStart(2, '0');

export function money(paise, { short = false } = {}) {
  return '₹' + (short ? inrShort : inr).format(Math.abs(paise) / 100);
}

export function signedMoney(paise, type, opts) {
  return (type === 'income' ? '+' : '-') + money(paise, opts);
}

export function groupInr(text) {
  const [whole, decimals] = text.split('.');
  const head = whole.slice(0, -3);
  const grouped = head ? head.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + whole.slice(-3) : whole;
  return decimals === undefined ? grouped : grouped + '.' + decimals;
}

export function toPaise(text) {
  return Math.round(parseFloat(text || '0') * 100) || 0;
}

export function esc(text) {
  return String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function todayISO(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function currentMonth() {
  return todayISO().slice(0, 7);
}

export function shiftMonth(ym, delta) {
  const [y, m] = ym.split('-').map(Number);
  return todayISO(new Date(y, m - 1 + delta, 1)).slice(0, 7);
}

export function monthTitle(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function shortDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function dayLabel(iso) {
  if (iso === todayISO()) return 'Today';
  if (iso === todayISO(new Date(Date.now() - 86400000))) return 'Yesterday';
  return shortDate(iso);
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
