# Home Budget: design notes

Source screens are in `design/` (`*.dc.html`, one per screen, 390x844 phone). Open them for exact spacing, sizes and copy. `design/canvas.json` lists the screens. Rebuild them in the app's framework; do not ship the HTML.

Published copy: https://claude.ai/artifact/U3CtPzpyjG9fRcpW2ztE3X

## What the app is
Offline-only income and expense tracker for adults and senior citizens who are not tech friendly. No account, no internet, no database server. Data is stored on the phone. No budgets: only income and expense transactions.

## Rules
- Currency is rupee only, fixed. Show as `₹`. No currency setting.
- Income is green with `+` and an up arrow. Expense is red with `-` and a down arrow. Never rely on colour alone.
- Any delete (transaction or category) must show a confirm dialog with Cancel and "Yes, delete". Cancel is the dark primary button.
- Only the current month's transactions can be edited. Past months and all report lists are read-only.
- Deleting a category moves its transactions to "Other".
- Export backup, Import backup and Export CSV live in Settings. Import asks merge or replace.
- Large text and big touch targets: body 16-17px, labels never below 14px, buttons at least 44px high (main buttons 56px). Short plain words.

## Colours
- Background `#F6F5F1`, card `#FFFFFF`, ink `#16211C`, muted text `#44524A`, divider `#EEF0EC`
- Income `#1B6B43` (tint `#E3F1E8`), expense `#B3261E` (tint `#F9E4E1`)
- Category colours (avoid green and red): amber `#C77B1C`, blue `#2F5D9E`, purple `#7A4FA3`, teal `#0F7C8A`, brown `#8A5A44`, slate `#44524A`, pink `#B02A6B`, indigo `#3F4BA8`
- Font: DM Sans

## Navigation
Bottom bar, 5 items in this order: Home, Reports, + (add transaction, round dark button), Categories, Settings. Shown on Home, Reports, By category, Categories, Settings.

## Screens
- `Main` Home: net balance card, income and expense tiles, then the current month and year heading with all that month's transactions. Tapping a row opens Edit transaction. "All months" goes to Reports.
- `AddExpense` / `EditExpense`: Expense or Income switch, amount, category chips plus "+ New", note, date, number pad, Save. Edit adds a delete button (with confirm) and "Save changes".
- `Reports`: tab "By month". Months expand to a read-only list of that month's transactions.
- `Analysis`: tab "By category". Filters: This month, Last month, Last 3 months, Last 6 months. Donut chart of expense by category, then a category list; each category expands to its read-only transactions.
- `Settings`: Categories row, Export backup, Import backup, Export CSV.
- `Categories`: Expense or Income list, "+ New category".
- `EditCategory`: name, type, colour swatches, Save, delete (with confirm). New category uses the same form, empty and without delete.

## Placeholders in the design
All names and amounts are sample data. The number pad, chips and filters are static drawings in the design; the app must make them work.

## Tech plan
- Android only. Web app (Vite, plain JavaScript) wrapped with Capacitor. UI must feel native: Material-style ripples, edge-to-edge with status bar and nav bar coloured, system Back button handled, native share sheet and file picker for backups, native date picker, haptics, respects system font size.
- Storage: files in the app's private data folder (Capacitor Filesystem, `Directory.Data`). `categories.json` plus one `YYYY-MM.json` per month. Amounts are stored as integer paise. Save by writing a `.tmp` file then renaming it over the real file. Only the changed month is rewritten.
- Backup export bundles all files into one JSON file; import splits it back into months (merge or replace).
- Build: GitHub Actions runs `npm ci`, `npm run build`, `npx cap sync android`, `./gradlew assembleDebug`, then attaches the APK to a GitHub Release.
- No Android SDK needed on the dev PC. Preview in the browser with `npm run dev` (phone-size view); dev mode seeds sample transactions.
