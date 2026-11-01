import { getMonth, saveMonth, listMonths } from './storage.js';
import { currentMonth, todayISO } from './format.js';

export async function seedSample() {
  if ((await listMonths()).length) return;
  const day = (offset) => todayISO(new Date(Date.now() - offset * 86400000));
  await saveMonth(currentMonth(), [
    { id: 's1', type: 'expense', amount: 2450, categoryId: 'food', note: 'Lunch with Priya', date: day(0) },
    { id: 's2', type: 'expense', amount: 4620, categoryId: 'food', note: 'Green Market', date: day(0) },
    { id: 's3', type: 'income', amount: 32000, categoryId: 'other-income', note: 'Freelance payment', date: day(0) },
    { id: 's4', type: 'expense', amount: 105000, categoryId: 'home', note: 'Rent', date: day(0) },
    { id: 's5', type: 'income', amount: 378000, categoryId: 'salary', note: 'Salary', date: day(0) },
  ]);
  await saveMonth('2026-10', [
    { id: 'o1', type: 'income', amount: 378000, categoryId: 'salary', note: 'Salary', date: '2026-10-30' },
    { id: 'o2', type: 'expense', amount: 8840, categoryId: 'food', note: 'Groceries', date: '2026-10-22' },
    { id: 'o3', type: 'expense', amount: 3200, categoryId: 'fun', note: 'Cinema', date: '2026-10-28' },
  ]);
}
