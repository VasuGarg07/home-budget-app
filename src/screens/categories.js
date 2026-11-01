import { getCategories, getAllMonths } from '../storage.js';
import { esc } from '../format.js';
import { icons } from '../icons.js';

let kind = 'expense';

export async function renderCategories(el) {
  const [cats, months] = await Promise.all([getCategories(), getAllMonths()]);
  const counts = {};
  for (const t of Object.values(months).flat()) counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
  const list = cats.filter((c) => c.type === kind);

  el.innerHTML = `
    <h1 class="title">Categories</h1>
    <div class="seg">
      <button data-k="expense" class="ripple${kind === 'expense' ? ' on dark-bg' : ''}">Expense</button>
      <button data-k="income" class="ripple${kind === 'income' ? ' on dark-bg' : ''}">Income</button>
    </div>
    <div class="list">
      ${list
        .map(
          (c) => `<a class="row ripple" href="#category/${c.id}"><i class="dot" style="background:${c.color}"></i><span class="grow row-title big">${esc(c.name)}</span><span class="muted">${counts[c.id] || 0}</span>${icons.next}</a>`
        )
        .join('')}
    </div>
    <a class="btn dark" href="#category/new?type=${kind}">+ New category</a>`;

  el.querySelector('.seg').onclick = (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    kind = b.dataset.k;
    renderCategories(el);
  };
}
