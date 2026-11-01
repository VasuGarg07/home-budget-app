const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const inrShort = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export function money(paise, { short = false } = {}) {
  const value = Math.abs(paise) / 100;
  return '₹' + (short ? inrShort : inr).format(value);
}

export function signedMoney(paise, type, opts) {
  return (type === 'income' ? '+' : '-') + money(paise, opts);
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function monthTitle(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function dayLabel(iso) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (iso === today) return 'Today';
  if (iso === yesterday) return 'Yesterday';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
