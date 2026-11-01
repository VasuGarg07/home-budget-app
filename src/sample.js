import { getMonth, saveMonth } from './storage.js';
import { currentMonth } from './format.js';

export async function seedSample() {
  const ym = currentMonth();
  if ((await getMonth(ym)).length) return;
  const day = (offset) => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);
  await saveMonth(ym, [
    { id: 's1', type: 'expense', amount: 2450, categoryId: 'food', note: 'Lunch with Priya', date: day(0) },
    { id: 's2', type: 'expense', amount: 4620, categoryId: 'food', note: 'Green Market', date: day(0) },
    { id: 's3', type: 'income', amount: 32000, categoryId: 'other-income', note: 'Freelance payment', date: day(1) },
    { id: 's4', type: 'expense', amount: 105000, categoryId: 'home', note: 'Rent', date: day(1) },
    { id: 's5', type: 'income', amount: 378000, categoryId: 'salary', note: 'Salary', date: day(1) },
  ]);
}
