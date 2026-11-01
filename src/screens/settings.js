import { getCategories } from '../storage.js';
import { exportBackup, exportCsv, importBackup } from '../backup.js';
import { App } from '@capacitor/app';
import { toast } from '../ui.js';
import { icons } from '../icons.js';

async function appVersion() {
  try {
    return (await App.getInfo()).version;
  } catch {
    return 'preview';
  }
}

export async function renderSettings(el) {
  const [cats, version] = await Promise.all([getCategories(), appVersion()]);
  el.innerHTML = `
    <h1 class="title">Settings</h1>
    <a class="list-row card-flat ripple" href="#categories"><span class="grow row-title big">Categories</span><span class="muted">${cats.length}</span>${icons.next}</a>
    <h2 class="sub">Your data</h2>
    <div class="list">
      <button class="list-btn ripple" id="exp">${icons.download}<span>Export backup</span></button>
      <button class="list-btn ripple" id="imp">${icons.upload}<span>Import backup</span></button>
      <button class="list-btn ripple" id="csv">${icons.sheet}<span>Export as spreadsheet (CSV)</span></button>
    </div>
    <p class="muted version">Version ${version}</p>`;

  const run = (fn) => async () => {
    try {
      await fn();
    } catch {
      toast('Something went wrong. Please try again.');
    }
  };
  el.querySelector('#exp').onclick = run(exportBackup);
  el.querySelector('#csv').onclick = run(exportCsv);
  el.querySelector('#imp').onclick = run(async () => {
    if (await importBackup()) renderSettings(el);
  });
}
