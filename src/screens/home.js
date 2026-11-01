import { getCategories, getMonth } from '../storage.js';
import { currentMonth, monthTitle, money } from '../format.js';
import { txRow, sumBy, byNewest } from '../rows.js';

export async function renderHome(el) {
  const ym = currentMonth();
  const [cats, txs] = await Promise.all([getCategories(), getMonth(ym)]);
  const names = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  const income = sumBy(txs, 'income');
  const expense = sumBy(txs, 'expense');
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
      ${txs.length ? byNewest(txs).map((t) => txRow(t, names[t.categoryId] || 'Other')).join('') : '<p class="empty">No transactions yet. Tap the + button to add one.</p>'}
    </div>`;
}
