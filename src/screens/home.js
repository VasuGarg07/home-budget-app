import { getCategories, getMonth } from '../storage.js';
import { currentMonth, monthTitle, money, signedMoney, dayLabel } from '../format.js';
import { icons } from '../icons.js';

function row(tx, categoryName) {
  const kind = tx.type === 'income' ? 'income' : 'expense';
  return `<a class="row ripple" href="#edit/${tx.id}">
    <div class="badge ${kind}">${kind === 'income' ? icons.up : icons.down}</div>
    <div class="grow"><div class="row-title">${tx.note || categoryName}</div><div class="muted">${categoryName} · ${dayLabel(tx.date)}</div></div>
    <div class="amount ${kind}">${signedMoney(tx.amount, tx.type)}</div>
  </a>`;
}

export async function renderHome(el) {
  const ym = currentMonth();
  const [cats, txs] = await Promise.all([getCategories(), getMonth(ym)]);
  const names = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  const sorted = [...txs].sort((a, b) => b.date.localeCompare(a.date));
  const income = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = income - expense;

  el.innerHTML = `
    <div class="card big">
      <div class="muted">Net balance</div>
      <div class="net ${net < 0 ? 'expense' : 'income'}">${net < 0 ? '-' : '+'}${money(net)}</div>
    </div>
    <div class="tiles">
      <div class="tile income-tint"><div>Income</div><b class="income">+${money(income, { short: true })}</b></div>
      <div class="tile expense-tint"><div>Expenses</div><b class="expense">-${money(expense, { short: true })}</b></div>
    </div>
    <div class="section-head">
      <h2>${monthTitle(ym)}</h2>
      <a class="link" href="#reports">All months</a>
    </div>
    <div class="list">
      ${sorted.length ? sorted.map((t) => row(t, names[t.categoryId] || 'Other')).join('') : '<p class="empty">No transactions yet. Tap the + button to add one.</p>'}
    </div>`;
}
