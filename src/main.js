import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import './style.css';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { renderHome } from './screens/home.js';
import { renderPlaceholder } from './screens/placeholder.js';
import { navBar } from './nav.js';
import { seedSample } from './sample.js';

const screens = { home: renderHome };
const root = document.getElementById('app');

async function show() {
  const name = location.hash.slice(1).split('/')[0] || 'home';
  const body = document.createElement('main');
  body.className = 'screen';
  await (screens[name] || ((el) => renderPlaceholder(el, name)))(body);
  root.replaceChildren(body, navBar(name));
}

async function start() {
  if (import.meta.env.DEV) await seedSample();
  window.addEventListener('hashchange', show);
  await show();
  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#F6F5F1' });
  } catch {}
  App.addListener('backButton', () => {
    if (location.hash && location.hash !== '#home') location.hash = '#home';
    else App.exitApp();
  });
}

start();
