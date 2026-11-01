import { getCategories, getMonth, listMonths } from '../storage.js';
import { currentMonth, monthTitle, money } from '../format.js';
import { miniRow, sumBy, byNewest } from '../rows.js';
import { icons } from '../icons.js';

export function reportTabs(active) {
  return `<div class="seg link-seg">
    <a class="ripple${active === 'month' ? ' on dark-bg' : ''}" href="#reports">By month</a>
    <a class="ripple${active === 'category' ? ' on dark-bg' : ''}" href="#analysis">By category</a>
  </div>`;
}

export async function renderReports(el) {
  const cats = await getCategories();
  const names = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  const months = [...new Set([currentMonth(), ...(await listMonths())])].sort().reverse();
  const data = await Promise.all(months.map(async (ym) => [ym, await getMonth(ym)]));

  const blocks = data.map(([ym, txs], i) => {
    const income = sumBy(txs, 'income');
    const expense = sumBy(txs, 'expense');
    const net = income - expense;
    return `<details class="acc"${i === 0 ? ' open' : ''}>
      <summary>
        <div class="grow row-title">${monthTitle(ym)}</div>
        <b class="${net < 0 ? 'expense' : 'income'}">${net < 0 ? '-' : '+'}${money(net, { short: true })}</b>
        <span class="chev">${icons.chevron}</span>
      </summary>
      <div class="acc-body">${txs.length ? byNewest(txs).map((t) => miniRow(t, names[t.categoryId] || 'Other')).join('') : '<p class="muted pad">No transactions</p>'}</div>
    </details>`;
  });

  el.innerHTML = `<h1 class="title">Reports</h1>${reportTabs('month')}<div class="stack">${blocks.join('')}</div>`;
}
