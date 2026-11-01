import { getCategories, getMonth } from '../storage.js';
import { currentMonth, shiftMonth, money, esc } from '../format.js';
import { miniRow, byNewest } from '../rows.js';
import { reportTabs } from './reports.js';
import { icons } from '../icons.js';

const ranges = [
  { id: 'this', label: 'This month', count: 1, start: 0 },
  { id: 'last', label: 'Last month', count: 1, start: -1 },
  { id: '3', label: 'Last 3 months', count: 3, start: -2 },
  { id: '6', label: 'Last 6 months', count: 6, start: -5 },
];

let picked = 'this';

export async function renderAnalysis(el) {
  const cats = await getCategories();
  const range = ranges.find((r) => r.id === picked);
  const yms = Array.from({ length: range.count }, (_, i) => shiftMonth(currentMonth(), range.start + i));
  const txs = (await Promise.all(yms.map(getMonth))).flat().filter((t) => t.type === 'expense');
  const total = txs.reduce((s, t) => s + t.amount, 0);

  const groups = cats
    .map((c) => ({ cat: c, items: txs.filter((t) => t.categoryId === c.id) }))
    .map((g) => ({ ...g, sum: g.items.reduce((s, t) => s + t.amount, 0) }))
    .filter((g) => g.sum > 0)
    .sort((a, b) => b.sum - a.sum);

  let offset = 0;
  const arcs = groups
    .map((g) => {
      const pct = (g.sum / total) * 100;
      const arc = `<circle cx="21" cy="21" r="15.9155" fill="none" stroke="${g.cat.color}" stroke-width="6" stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="${-offset}" transform="rotate(-90 21 21)"/>`;
      offset += pct;
      return arc;
    })
    .join('');

  el.innerHTML = `
    <h1 class="title">Reports</h1>
    ${reportTabs('category')}
    <div class="filters">${ranges.map((r) => `<button class="pill ripple${r.id === picked ? ' on' : ''}" data-r="${r.id}">${r.label}</button>`).join('')}</div>
    ${
      total
        ? `<div class="donut"><svg role="img" aria-label="Spending by category" width="150" height="150" viewBox="0 0 42 42">${arcs}</svg>
            <div class="donut-mid"><div class="muted">Spent</div><b class="expense">${money(total, { short: true })}</b></div></div>
          <div class="stack">${groups
            .map(
              (g) => `<details class="acc"${g === groups[0] ? ' open' : ''}>
              <summary><i class="dot" style="background:${g.cat.color}"></i><span class="grow row-title">${esc(g.cat.name)}</span><b>${money(g.sum, { short: true })}</b><span class="muted pct">${Math.round((g.sum / total) * 100)}%</span><span class="chev">${icons.chevron}</span></summary>
              <div class="acc-body">${byNewest(g.items).map((t) => miniRow(t, g.cat.name)).join('')}</div></details>`
            )
            .join('')}</div>`
        : '<p class="empty">No expenses in this period.</p>'
    }`;

  el.querySelector('.filters').onclick = (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    picked = b.dataset.r;
    renderAnalysis(el);
  };
}
