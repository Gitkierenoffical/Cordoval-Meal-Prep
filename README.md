# Cordoval Meal Prep

Plan a week of meals and get a shopping list from those meals.

Live: https://meal-prep.cordoval.co.uk

Cordoval web app. Privacy-first and local-first: meal plans, ingredients, and shopping list ticks stay in your browser. No accounts and no cloud sync.

## What it does

- **Week plan:** Monday to Sunday with Breakfast, Lunch, Dinner, and optional Snack per day. Move between weeks with Previous week and Next week.
- **Meals:** Add meal names and free-text ingredients (one per line or comma separated).
- **Shopping list:** Ingredients are aggregated across the week, deduplicated case-insensitively when the line matches. Tick items off as you shop.
- **Copy list:** Copy the shopping list to the clipboard with visible "Copied" feedback.
- **Clear week / clear ticks:** Destructive actions ask for confirmation.

## Storage

User content is stored only in **IndexedDB** on this device (`cordoval-meal-prep` database). Nothing is sent to a server.

On first visit the app calls `navigator.storage.persist()` so the browser is less likely to clear your data. If persistence is not granted, a banner explains that you should use Backup regularly.

### Backup and Load

- **Backup** downloads a JSON file (`formatVersion`, `productSlug: meal-prep`, and your week + ticks). The file stays on your device.
- **Load** lets you pick that file, validates format and slug, asks you to confirm, then replaces IndexedDB content on this device only.

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
```

Stack: Vite, React, TypeScript.

## Legal

Privacy and Terms links in the app point to the shared Cordoval pages at [scrub.cordoval.co.uk](https://scrub.cordoval.co.uk).
