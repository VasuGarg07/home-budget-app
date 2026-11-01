import { getCategories, findTransaction, saveTransaction, deleteTransaction } from '../storage.js';
import { money, toPaise, todayISO, newId, esc } from '../format.js';
import { session } from '../session.js';
import { confirmDelete, toast } from '../ui.js';
import { icons } from '../icons.js';

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

export async function renderForm(el, id) {
  const cats = await getCategories();
  const found = id ? await findTransaction(id) : null;
  let state = { type: 'expense', amount: '', categoryId: null, note: '', date: todayISO() };
  if (found) state = { type: found.tx.type, amount: Number.isInteger(found.tx.amount / 100) ? String(found.tx.amount / 100) : (found.tx.amount / 100).toFixed(2), categoryId: found.tx.categoryId, note: found.tx.note || '', date: found.tx.date };
  if (session.draft && session.draft.editId === (id || null)) {
    state = session.draft;
    session.draft = null;
  }
  if (session.newCategoryId) {
    state.categoryId = session.newCategoryId;
    session.newCategoryId = null;
  }

  el.classList.add('form');
  el.innerHTML = `
    <div class="top">
      <button class="round ripple" id="close" aria-label="Close">${icons.close}</button>
      <h1>${found ? 'Edit transaction' : 'Add transaction'}</h1>
      ${found ? `<button class="round danger-tint ripple" id="del" aria-label="Delete transaction">${icons.trash}</button>` : '<span class="round-space"></span>'}
    </div>
    <div class="seg">
      <button id="t-expense" class="ripple">Expense</button>
      <button id="t-income" class="ripple">Income</button>
    </div>
    <div class="amount-box"><div class="muted">Amount</div><div id="amt" class="big-amount"></div></div>
    <div id="chips" class="chips"></div>
    <div class="fields card-flat">
      <label class="field"><span class="muted">Note</span><input id="note" maxlength="60" value="${esc(state.note)}"></label>
      <label class="field"><span class="muted">Date</span><input id="date" type="date" max="${todayISO()}" value="${state.date}"></label>
    </div>
    <div class="keypad">${keys.map((k) => `<button class="key ripple" data-k="${k}" ${k === '⌫' ? 'aria-label="Delete digit"' : ''}>${k}</button>`).join('')}</div>
    <button class="btn dark" id="save">${found ? 'Save changes' : 'Save'}</button>`;

  const q = (s) => el.querySelector(s);

  function paint() {
    const list = cats.filter((c) => c.type === state.type);
    if (!list.some((c) => c.id === state.categoryId)) state.categoryId = list[0]?.id || null;
    q('#t-expense').className = 'ripple' + (state.type === 'expense' ? ' on expense-bg' : '');
    q('#t-income').className = 'ripple' + (state.type === 'income' ? ' on income-bg' : '');
    const amt = q('#amt');
    amt.className = 'big-amount ' + state.type;
    amt.textContent = (state.type === 'income' ? '+₹' : '-₹') + (state.amount || '0');
    q('#chips').innerHTML =
      list.map((c) => `<button class="chip ripple${c.id === state.categoryId ? ' on' : ''}" data-c="${c.id}">${esc(c.name)}</button>`).join('') +
      '<button class="chip dashed ripple" id="new-cat">+ New</button>';
  }

  q('#t-expense').onclick = () => { state.type = 'expense'; paint(); };
  q('#t-income').onclick = () => { state.type = 'income'; paint(); };
  q('#chips').onclick = (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.id === 'new-cat') {
      session.draft = { ...state, editId: id || null };
      location.hash = '#category/new?type=' + state.type;
    } else {
      state.categoryId = b.dataset.c;
      paint();
    }
  };
  q('.keypad').onclick = (e) => {
    const k = e.target.closest('button')?.dataset.k;
    if (!k) return;
    if (k === '⌫') state.amount = state.amount.slice(0, -1);
    else if (k === '.') { if (!state.amount.includes('.')) state.amount = (state.amount || '0') + '.'; }
    else if (state.amount.length < 9 && !/\.\d\d$/.test(state.amount)) state.amount = state.amount === '0' ? k : state.amount + k;
    paint();
  };
  q('#note').oninput = (e) => { state.note = e.target.value; };
  q('#date').onchange = (e) => { if (e.target.value) state.date = e.target.value; };
  q('#close').onclick = () => history.back();
  if (found) {
    q('#del').onclick = async () => {
      const ok = await confirmDelete('Delete this transaction?', `${found.tx.note || 'This transaction'}, ${money(found.tx.amount)} will be removed for good.`);
      if (!ok) return;
      await deleteTransaction(found.tx.id, found.ym);
      toast('Deleted');
      location.hash = '#home';
    };
  }
  q('#save').onclick = async () => {
    const amount = toPaise(state.amount);
    if (!amount) return toast('Enter an amount');
    if (!state.categoryId) return toast('Choose a category');
    await saveTransaction({ id: found ? found.tx.id : newId(), type: state.type, amount, categoryId: state.categoryId, note: state.note.trim(), date: state.date }, found?.ym);
    toast('Saved');
    location.hash = '#home';
  };
  paint();
}
