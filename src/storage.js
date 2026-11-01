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
