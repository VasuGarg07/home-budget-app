import './style.css';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { renderHome } from './screens/home.js';
import { renderForm } from './screens/form.js';
import { renderReports } from './screens/reports.js';
import { renderAnalysis } from './screens/analysis.js';
import { renderCategories } from './screens/categories.js';
import { renderCategoryForm } from './screens/categoryForm.js';
import { renderSettings } from './screens/settings.js';
import { navBar } from './nav.js';
import { seedSample } from './sample.js';

const routes = {
  home: { render: renderHome, nav: 'home' },
  reports: { render: renderReports, nav: 'reports' },
  analysis: { render: renderAnalysis, nav: 'reports' },
  categories: { render: renderCategories, nav: 'categories' },
  settings: { render: renderSettings, nav: 'settings' },
  add: { render: renderForm },
  edit: { render: renderForm },
  category: { render: renderCategoryForm },
};

const root = document.getElementById('app');

async function show() {
  const [path, query] = (location.hash.slice(1) || 'home').split('?');
  const [name, arg] = path.split('/');
  const route = routes[name] || routes.home;
  const body = document.createElement('main');
  body.className = 'screen';
  await route.render(body, arg, new URLSearchParams(query));
  root.replaceChildren(...(route.nav ? [body, navBar(route.nav)] : [body]));
}

function watchKeyboard() {
  const vv = window.visualViewport;
  if (!vv) return;
  const fullHeight = window.innerHeight;
  vv.addEventListener('resize', () => document.body.classList.toggle('kb', vv.height < fullHeight * 0.75));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('input')) e.target.blur();
  });
  document.addEventListener('focusin', (e) => {
    if (e.target.matches('input')) setTimeout(() => e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
  });
}

async function start() {
  if (import.meta.env.DEV) await seedSample();
  window.addEventListener('hashchange', show);
  watchKeyboard();
  await show();
  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#F6F5F1' });
  } catch {}
  App.addListener('backButton', () => {
    const name = (location.hash.slice(1) || 'home').split(/[/?]/)[0];
    if (!routes[name]?.nav) history.back();
    else if (name !== 'home') location.hash = '#home';
    else App.exitApp();
  });
}

start();
