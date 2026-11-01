import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const dir = Directory.Data;

async function readJson(path, fallback) {
  try {
    const res = await Filesystem.readFile({ path, directory: dir, encoding: Encoding.UTF8 });
    return JSON.parse(res.data);
  } catch {
    return fallback;
  }
}

async function writeJson(path, value) {
  const tmp = path + '.tmp';
  await Filesystem.writeFile({ path: tmp, directory: dir, encoding: Encoding.UTF8, data: JSON.stringify(value) });
  await Filesystem.rename({ from: tmp, to: path, directory: dir, toDirectory: dir });
}

const defaultCategories = [
  { id: 'food', name: 'Food', type: 'expense', color: '#C77B1C' },
  { id: 'transport', name: 'Transport', type: 'expense', color: '#2F5D9E' },
  { id: 'home', name: 'Home', type: 'expense', color: '#0F7C8A' },
  { id: 'fun', name: 'Fun', type: 'expense', color: '#7A4FA3' },
  { id: 'other', name: 'Other', type: 'expense', color: '#44524A' },
  { id: 'salary', name: 'Salary', type: 'income', color: '#3F4BA8' },
  { id: 'other-income', name: 'Other income', type: 'income', color: '#8A5A44' },
];

export const fallbackCategory = { expense: 'other', income: 'other-income' };

export async function getCategories() {
  const saved = await readJson('categories.json', null);
  if (saved) return saved;
  await writeJson('categories.json', defaultCategories);
  return defaultCategories;
}

export function saveCategories(list) {
  return writeJson('categories.json', list);
}

export function getMonth(ym) {
  return readJson(ym + '.json', []);
}

export function saveMonth(ym, list) {
  return writeJson(ym + '.json', list);
}

export async function listMonths() {
  try {
    const res = await Filesystem.readdir({ path: '', directory: dir });
    return res.files
      .map((f) => f.name)
      .filter((n) => /^\d{4}-\d{2}\.json$/.test(n))
      .map((n) => n.slice(0, 7))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export async function getAllMonths() {
  const out = {};
  for (const ym of await listMonths()) out[ym] = await getMonth(ym);
  return out;
}

export async function findTransaction(id) {
  for (const ym of await listMonths()) {
    const tx = (await getMonth(ym)).find((t) => t.id === id);
    if (tx) return { tx, ym };
  }
  return null;
}

export async function saveTransaction(tx, oldYm) {
  const ym = tx.date.slice(0, 7);
  if (oldYm && oldYm !== ym) {
    await saveMonth(oldYm, (await getMonth(oldYm)).filter((t) => t.id !== tx.id));
  }
  const list = await getMonth(ym);
  const at = list.findIndex((t) => t.id === tx.id);
  if (at >= 0) list[at] = tx;
  else list.push(tx);
  await saveMonth(ym, list);
}

export async function deleteTransaction(id, ym) {
  await saveMonth(ym, (await getMonth(ym)).filter((t) => t.id !== id));
}

export async function saveCategory(cat) {
  const list = await getCategories();
  const at = list.findIndex((c) => c.id === cat.id);
  if (at >= 0) list[at] = cat;
  else list.push(cat);
  await saveCategories(list);
}

export async function deleteCategory(id) {
  const list = await getCategories();
  const cat = list.find((c) => c.id === id);
  if (!cat) return;
  await saveCategories(list.filter((c) => c.id !== id));
  const target = fallbackCategory[cat.type];
  const months = await getAllMonths();
  for (const [ym, txs] of Object.entries(months)) {
    if (txs.some((t) => t.categoryId === id)) {
      await saveMonth(ym, txs.map((t) => (t.categoryId === id ? { ...t, categoryId: target } : t)));
    }
  }
}

export async function exportAll() {
  return { app: 'home-budget', version: 1, categories: await getCategories(), months: await getAllMonths() };
}

export async function importAll(data, mode) {
  if (mode === 'replace') {
    for (const ym of await listMonths()) {
      await Filesystem.deleteFile({ path: ym + '.json', directory: dir });
    }
    await saveCategories(data.categories);
    for (const [ym, txs] of Object.entries(data.months)) await saveMonth(ym, txs);
    return;
  }
  const cats = await getCategories();
  const known = new Set(cats.map((c) => c.id));
  await saveCategories([...cats, ...data.categories.filter((c) => !known.has(c.id))]);
  for (const [ym, txs] of Object.entries(data.months)) {
    const mine = await getMonth(ym);
    const ids = new Set(mine.map((t) => t.id));
    await saveMonth(ym, [...mine, ...txs.filter((t) => !ids.has(t.id))]);
  }
}
