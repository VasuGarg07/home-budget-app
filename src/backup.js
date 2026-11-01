import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { exportAll, importAll, getCategories } from './storage.js';
import { todayISO } from './format.js';
import { dialog, toast } from './ui.js';

async function shareFile(name, text, mime) {
  if (Capacitor.isNativePlatform()) {
    const file = await Filesystem.writeFile({ path: name, directory: Directory.Cache, data: text, encoding: Encoding.UTF8 });
    try {
      await Share.share({ title: name, url: file.uri });
    } catch {}
    return;
  }
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([text], { type: mime }));
  link.download = name;
  link.click();
}

export async function exportBackup() {
  await shareFile(`home-budget-backup-${todayISO()}.json`, JSON.stringify(await exportAll()), 'application/json');
}

const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

export async function exportCsv() {
  const data = await exportAll();
  const names = Object.fromEntries(data.categories.map((c) => [c.id, c.name]));
  const rows = [['Date', 'Type', 'Category', 'Note', 'Amount (INR)']];
  for (const txs of Object.values(data.months)) {
    for (const t of txs) rows.push([t.date, t.type, names[t.categoryId] || '', t.note || '', (t.amount / 100).toFixed(2)]);
  }
  await shareFile(`home-budget-${todayISO()}.csv`, rows.map((r) => r.map(csvCell).join(',')).join('\n'), 'text/csv');
}

function pickFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => resolve(input.files[0] || null);
    input.click();
  });
}

function valid(data) {
  return data && data.app === 'home-budget' && Array.isArray(data.categories) && data.months && typeof data.months === 'object';
}

export async function importBackup() {
  const file = await pickFile();
  if (!file) return false;
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch {}
  if (!valid(data)) {
    toast('This is not a Home Budget backup file');
    return false;
  }
  const mode = await dialog({
    title: 'Import backup',
    text: 'Merge adds the backup to what is on this phone. Replace erases this phone first.',
    actions: [
      { label: 'Merge', value: 'merge', kind: 'dark' },
      { label: 'Replace everything', value: 'replace', kind: 'danger' },
      { label: 'Cancel', value: null, kind: 'ghost' },
    ],
  });
  if (!mode) return false;
  await importAll(data, mode);
  await getCategories();
  toast('Backup imported');
  return true;
}
