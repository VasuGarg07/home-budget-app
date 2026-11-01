import { getCategories, getAllMonths, saveCategory, deleteCategory, fallbackCategory } from '../storage.js';
import { esc, newId } from '../format.js';
import { session } from '../session.js';
import { confirmDelete, toast } from '../ui.js';
import { icons } from '../icons.js';

const colors = ['#C77B1C', '#2F5D9E', '#7A4FA3', '#0F7C8A', '#8A5A44', '#44524A', '#B02A6B', '#3F4BA8'];
const protectedIds = Object.values(fallbackCategory);

export async function renderCategoryForm(el, id, params) {
  const cats = await getCategories();
  const existing = id === 'new' ? null : cats.find((c) => c.id === id);
  const state = existing ? { ...existing } : { id: 'c-' + newId(), name: '', type: params.get('type') === 'income' ? 'income' : 'expense', color: colors[0] };
  const leave = () => (session.draft ? history.back() : (location.hash = '#categories'));

  el.classList.add('form');
  el.innerHTML = `
    <div class="top">
      <button class="round ripple" id="close" aria-label="Close">${icons.close}</button>
      <h1>${existing ? 'Edit category' : 'New category'}</h1>
      ${existing && !protectedIds.includes(existing.id) ? `<button class="round danger-tint ripple" id="del" aria-label="Delete category">${icons.trash}</button>` : '<span class="round-space"></span>'}
    </div>
    <label class="stack-tight"><span class="muted">Name</span><input id="name" class="input" maxlength="24" value="${esc(state.name)}"></label>
    <div class="stack-tight"><span class="muted">Type</span>
      <div class="seg"><button id="t-expense" class="ripple">Expense</button><button id="t-income" class="ripple">Income</button></div></div>
    <div class="stack-tight"><span class="muted">Colour</span><div class="swatches" id="sw"></div></div>
    <div class="spacer"></div>
    <button class="btn dark" id="save">Save category</button>`;

  const q = (s) => el.querySelector(s);

  function paint() {
    q('#t-expense').className = 'ripple' + (state.type === 'expense' ? ' on dark-bg' : '');
    q('#t-income').className = 'ripple' + (state.type === 'income' ? ' on dark-bg' : '');
    q('#sw').innerHTML = colors
      .map((c) => `<button class="swatch ripple${c === state.color ? ' on' : ''}" data-c="${c}" style="background:${c}" aria-label="Colour ${c}"></button>`)
      .join('');
  }

  if (existing) {
    q('#t-expense').disabled = q('#t-income').disabled = true;
  } else {
    q('#t-expense').onclick = () => { state.type = 'expense'; paint(); };
    q('#t-income').onclick = () => { state.type = 'income'; paint(); };
  }
  q('#sw').onclick = (e) => {
    const b = e.target.closest('button');
    if (b) { state.color = b.dataset.c; paint(); }
  };
  q('#name').oninput = (e) => { state.name = e.target.value; };
  q('#close').onclick = leave;
  if (q('#del')) {
    q('#del').onclick = async () => {
      const used = Object.values(await getAllMonths()).flat().filter((t) => t.categoryId === state.id).length;
      const ok = await confirmDelete(`Delete ${state.name}?`, `Its ${used} transactions will be moved to Other.`);
      if (!ok) return;
      await deleteCategory(state.id);
      toast('Deleted');
      location.hash = '#categories';
    };
  }
  q('#save').onclick = async () => {
    const name = state.name.trim();
    if (!name) return toast('Enter a name');
    await saveCategory({ ...state, name });
    if (!existing) session.newCategoryId = state.id;
    toast('Saved');
    leave();
  };
  paint();
}
