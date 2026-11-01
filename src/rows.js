import { esc, signedMoney, dayLabel, shortDate } from './format.js';
import { icons } from './icons.js';

export function txRow(tx, categoryName) {
  const kind = tx.type;
  return `<a class="row ripple" href="#edit/${tx.id}">
    <div class="badge ${kind}">${kind === 'income' ? icons.up : icons.down}</div>
    <div class="grow"><div class="row-title">${esc(tx.note || categoryName)}</div><div class="muted">${esc(categoryName)} · ${dayLabel(tx.date)}</div></div>
    <div class="amount ${kind}">${signedMoney(tx.amount, tx.type)}</div>
  </a>`;
}

export function miniRow(tx, categoryName) {
  return `<div class="mini"><span>${shortDate(tx.date)} · ${esc(tx.note || categoryName)}</span><b class="${tx.type}">${signedMoney(tx.amount, tx.type)}</b></div>`;
}

export function sumBy(txs, type) {
  return txs.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
}

export function byNewest(txs) {
  return [...txs].sort((a, b) => b.date.localeCompare(a.date));
}
