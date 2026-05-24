# 🎨 TransportFlow — UI Design Specification (Tailwind CSS)

> This document is the **single source of truth** for all UI/UX decisions in the TransportFlow project.
> Every component, page, color, spacing, and interaction is expressed exclusively in **Tailwind CSS utility classes**.
> No custom CSS. No inline styles. No CSS variables. Tailwind only.
> When in doubt — refer here first.

---

## 1. Design Philosophy

### Aesthetic Direction: **Industrial Precision**

TransportFlow is for fleet managers, dispatchers, and logistics teams working in high-stakes environments. The UI must feel **authoritative, fast, and trustworthy** — not decorative. Think mission control, not SaaS startup.

### Core Principles

| Principle | Meaning |
|-----------|---------|
| **Data First** | Every screen surfaces information. Never let decoration obscure data. |
| **Status at a Glance** | Color-coded badges communicate state without reading text. |
| **Density with Breathing Room** | Tables are dense — but section spacing is generous. |
| **No Surprise Navigation** | Users always know where they are. |
| **Mobile-Aware** | Responsive layouts — desktop is primary. |

---

## 2. Tailwind Configuration

Add these custom colors and fonts to `tailwind.config.js`. All component classes in this spec reference these tokens.

```js
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        canvas:   '#0d0f14',
        surface:  '#161922',
        elevated: '#1e2330',
        hover:    '#252a38',
        border:   '#2a3040',

        // Brand
        primary: {
          DEFAULT: '#f97316',
          hover:   '#ea6c0a',
          muted:   'rgba(249,115,22,0.12)',
        },

        // Text
        'text-primary':   '#f0f2f7',
        'text-secondary': '#8b92a5',
        'text-tertiary':  '#555d72',

        // Status
        success: '#22c55e',
        warning: '#f59e0b',
        danger:  '#ef4444',
        info:    '#3b82f6',
        neutral: '#6b7280',

        // Accents
        'accent-cyan':   '#06b6d4',
        'accent-purple': '#8b5cf6',
      },
      fontFamily: {
        body:    ['Barlow', ...defaultTheme.fontFamily.sans],
        display: ['Barlow Condensed', ...defaultTheme.fontFamily.sans],
        mono:    ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
```

Add this import to `client/public/index.html` inside `<head>`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

Add this to `src/index.css` (the only allowed custom CSS):

```css
body {
  font-family: 'Barlow', sans-serif;
  background-color: #0d0f14;
  color: #f0f2f7;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
```

---

## 3. Color Usage Rules (Tailwind Class Reference)

| Purpose | Tailwind Class |
|---------|---------------|
| Page background | `bg-canvas` |
| Card / panel background | `bg-surface` |
| Modal / dropdown background | `bg-elevated` |
| Row / button hover | `hover:bg-hover` |
| All borders & dividers | `border-border` |
| Primary CTA background | `bg-primary` |
| Primary CTA hover | `hover:bg-primary-hover` |
| Primary tint background | `bg-primary-muted` |
| Primary text / active item | `text-primary` |
| Page headings | `text-text-primary` |
| Subtext / labels | `text-text-secondary` |
| Disabled / placeholder | `text-text-tertiary` |
| Text on orange button | `text-canvas` |

---

## 4. Typography Classes

### Font Families
| Usage | Class |
|-------|-------|
| All body text, labels, tables | `font-body` (default — applied globally) |
| Page headings, KPI numbers, nav title | `font-display` |
| IDs, registration numbers, trip codes | `font-mono` |

### Type Scale
| Size | Class | Use |
|------|-------|-----|
| 11px | `text-xs` | Table metadata, timestamps, badge labels |
| 13px | `text-sm` | Table body, form labels, description text |
| 15px | `text-base` | Body text, form inputs |
| 17px | `text-[17px]` | Section subheadings |
| 20px | `text-lg` or `text-xl` | Card titles, page subheadings |
| 24px | `text-2xl` | Page headings |
| 32px | `text-4xl` | KPI numbers |
| 44px | `text-5xl` | Hero dashboard stats |

### Font Weights
| Usage | Class |
|-------|-------|
| Page title `<h1>` | `font-display font-bold` |
| Section heading `<h2>` | `font-display font-semibold` |
| Card title | `font-semibold` |
| Table header | `font-semibold` |
| Table body | `font-normal` |
| KPI number | `font-display font-bold` |
| KPI label | `font-medium uppercase tracking-widest` |
| Button text | `font-semibold` |
| ID / code values | `font-mono font-medium` |

---

## 5. Layout & Spacing

### App Shell

```jsx
// Root layout wrapper
<div className="flex min-h-screen bg-canvas">

  {/* Sidebar */}
  <aside className="w-60 shrink-0 fixed top-0 left-0 h-screen bg-surface border-r border-border flex flex-col z-40">
    ...
  </aside>

  {/* Main content area */}
  <main className="ml-60 flex-1 flex flex-col min-h-screen">

    {/* Topbar */}
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      ...
    </header>

    {/* Page content */}
    <div className="flex-1 p-6">
      ...
    </div>

  </main>
</div>
```

### Spacing Reference (use Tailwind scale — never arbitrary values)

| Token | Tailwind | px |
|-------|----------|----|
| xs | `p-1` / `gap-1` | 4px |
| sm | `p-2` / `gap-2` | 8px |
| md | `p-3` / `gap-3` | 12px |
| base | `p-4` / `gap-4` | 16px |
| lg | `p-5` / `gap-5` | 20px |
| xl | `p-6` / `gap-6` | 24px |
| 2xl | `p-8` / `gap-8` | 32px |
| 3xl | `p-10` / `gap-10` | 40px |
| 4xl | `p-12` / `gap-12` | 48px |

### Border Radius Reference

| Usage | Tailwind Class |
|-------|---------------|
| Badges, chips, tags | `rounded` (4px) |
| Inputs, buttons, rows | `rounded-md` (8px) |
| Cards, panels | `rounded-xl` (12px) |
| Modals | `rounded-2xl` (16px) |
| Pills, avatars | `rounded-full` |

---

## 6. Component Specifications

### 6.1 Sidebar

```jsx
<aside className="w-60 shrink-0 fixed top-0 left-0 h-screen bg-surface border-r border-border flex flex-col z-40">

  {/* Logo */}
  <div className="h-16 flex items-center gap-3 px-5 border-b border-border">
    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
      <LuTruck className="text-canvas" size={18} />
    </div>
    <span className="font-display font-bold text-xl text-text-primary tracking-tight">
      TransportFlow
    </span>
  </div>

  {/* Navigation */}
  <nav className="flex-1 py-4 px-3 overflow-y-auto">
    <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary px-2 mb-2">
      Main
    </p>

    {/* Active nav item */}
    <a className="flex items-center gap-3 px-3 h-11 rounded-lg mb-1
                  bg-primary-muted border-l-[3px] border-primary
                  text-primary font-medium text-sm cursor-pointer">
      <LuLayoutDashboard size={18} />
      Dashboard
    </a>

    {/* Inactive nav item */}
    <a className="flex items-center gap-3 px-3 h-11 rounded-lg mb-1
                  text-text-secondary font-medium text-sm
                  hover:bg-hover hover:text-text-primary
                  transition-colors duration-150 cursor-pointer">
      <LuTruck size={18} />
      Vehicles
    </a>
  </nav>

  {/* User profile */}
  <div className="p-4 border-t border-border">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center
                      text-canvas font-bold text-sm shrink-0">
        JD
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">John Doe</p>
        <p className="text-xs text-text-secondary capitalize">admin</p>
      </div>
      <button className="text-text-tertiary hover:text-text-secondary transition-colors">
        <LuLogOut size={16} />
      </button>
    </div>
  </div>

</aside>
```

### 6.2 Topbar

```jsx
<header className="h-14 bg-surface border-b border-border
                   flex items-center justify-between px-6 sticky top-0 z-30">

  {/* Page title */}
  <h1 className="font-display font-bold text-2xl text-text-primary tracking-tight">
    Dashboard
  </h1>

  {/* Right side actions */}
  <div className="flex items-center gap-3">
    {/* Search */}
    <div className="relative hidden md:block">
      <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={15} />
      <input
        className="bg-elevated border border-border rounded-lg pl-9 pr-4 py-2
                   text-sm text-text-primary placeholder:text-text-tertiary
                   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                   w-56 transition-all duration-150"
        placeholder="Search..."
      />
    </div>

    {/* Notification bell */}
    <button className="relative w-9 h-9 rounded-lg flex items-center justify-center
                       text-text-secondary hover:bg-hover hover:text-text-primary
                       transition-colors duration-150">
      <LuBell size={18} />
      {/* Badge */}
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
    </button>

    {/* Date */}
    <span className="text-xs text-text-secondary hidden lg:block">
      Sun, 24 May 2026
    </span>
  </div>

</header>
```

### 6.3 KPI Card

```jsx
// icon, label, value, trend, trendUp, iconBg, iconColor are props

<div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4
                hover:border-border/80 transition-colors duration-200">

  {/* Top row: icon + optional trend */}
  <div className="flex items-start justify-between">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
      <Icon className={iconColor} size={20} />
    </div>
    <span className={`text-xs font-semibold flex items-center gap-1
                      ${trendUp ? 'text-success' : 'text-danger'}`}>
      {trendUp ? '↑' : '↓'} {trend}
    </span>
  </div>

  {/* Metric */}
  <div>
    <p className="font-display font-bold text-5xl text-text-primary leading-none mb-1">
      {value}
    </p>
    <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">
      {label}
    </p>
  </div>

  {/* Footer */}
  <p className="text-xs text-text-tertiary border-t border-border pt-3 mt-auto">
    vs last month
  </p>

</div>
```

**KPI icon color combos (use as `iconBg` + `iconColor` props):**

| Metric | `iconBg` | `iconColor` |
|--------|----------|-------------|
| Vehicles | `bg-cyan-500/10` | `text-accent-cyan` |
| Drivers | `bg-violet-500/10` | `text-accent-purple` |
| Active Trips | `bg-primary-muted` | `text-primary` |
| Deliveries | `bg-green-500/10` | `text-success` |

### 6.4 StatusBadge

**The single most important component. Every status value in the entire app must go through this component.**

```jsx
const statusMap = {
  // Vehicle statuses
  available:          { label: 'Available',         classes: 'bg-green-500/10  text-green-400' },
  'in-transit':       { label: 'In Transit',         classes: 'bg-amber-500/10  text-amber-400' },
  maintenance:        { label: 'Maintenance',        classes: 'bg-red-500/10    text-red-400'   },
  retired:            { label: 'Retired',            classes: 'bg-zinc-500/10   text-zinc-400'  },
  // Driver statuses
  'on-trip':          { label: 'On Trip',            classes: 'bg-amber-500/10  text-amber-400' },
  'off-duty':         { label: 'Off Duty',           classes: 'bg-zinc-500/10   text-zinc-400'  },
  suspended:          { label: 'Suspended',          classes: 'bg-red-500/10    text-red-400'   },
  // Trip statuses
  scheduled:          { label: 'Scheduled',          classes: 'bg-blue-500/10   text-blue-400'  },
  loading:            { label: 'Loading',            classes: 'bg-cyan-500/10   text-cyan-400'  },
  delivered:          { label: 'Delivered',          classes: 'bg-green-500/10  text-green-400' },
  completed:          { label: 'Completed',          classes: 'bg-green-500/10  text-green-400' },
  cancelled:          { label: 'Cancelled',          classes: 'bg-zinc-500/10   text-zinc-400'  },
  // Delivery statuses
  pending:            { label: 'Pending',            classes: 'bg-amber-500/10  text-amber-400' },
  dispatched:         { label: 'Dispatched',         classes: 'bg-blue-500/10   text-blue-400'  },
  'out-for-delivery': { label: 'Out for Delivery',   classes: 'bg-cyan-500/10   text-cyan-400'  },
  failed:             { label: 'Failed',             classes: 'bg-red-500/10    text-red-400'   },
  // Priority levels
  urgent:             { label: 'Urgent',             classes: 'bg-red-500/10    text-red-400'   },
  high:               { label: 'High',               classes: 'bg-amber-500/10  text-amber-400' },
  medium:             { label: 'Medium',             classes: 'bg-blue-500/10   text-blue-400'  },
  low:                { label: 'Low',                classes: 'bg-zinc-500/10   text-zinc-400'  },
};

export function StatusBadge({ status }) {
  const config = statusMap[status] ?? { label: status, classes: 'bg-zinc-500/10 text-zinc-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                      text-xs font-semibold uppercase tracking-wider ${config.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
```

### 6.5 Data Table

```jsx
{/* Table wrapper card */}
<div className="bg-surface border border-border rounded-xl overflow-hidden">

  {/* Table header bar (search + actions) */}
  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
    <div className="flex items-center gap-3">
      <div className="relative">
        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
        <input
          className="bg-elevated border border-border rounded-lg pl-8 pr-4 py-1.5
                     text-sm text-text-primary placeholder:text-text-tertiary
                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                     w-52 transition-all duration-150"
          placeholder="Search vehicles..."
        />
      </div>
      {/* Status filter */}
      <select className="bg-elevated border border-border rounded-lg px-3 py-1.5
                         text-sm text-text-secondary focus:outline-none focus:border-primary
                         focus:ring-2 focus:ring-primary/20 cursor-pointer">
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="in-transit">In Transit</option>
      </select>
    </div>
    <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover
                       text-canvas text-sm font-semibold px-4 py-2 rounded-lg
                       transition-colors duration-150 active:scale-95">
      <LuPlus size={16} />
      Add Vehicle
    </button>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-elevated border-b border-border">
          <th className="text-left px-4 py-3 text-xs font-semibold uppercase
                         tracking-widest text-text-secondary whitespace-nowrap">
            Reg. Number
          </th>
          {/* more headers */}
        </tr>
      </thead>
      <tbody>
        {/* Data row */}
        <tr className="border-b border-border hover:bg-hover transition-colors
                       duration-100 cursor-pointer group">
          <td className="px-4 py-4">
            {/* Registration number — always mono */}
            <span className="font-mono text-sm font-medium text-text-secondary">
              MH12AB3456
            </span>
          </td>
          <td className="px-4 py-4">
            <span className="text-sm font-medium text-text-primary">Tata Prima</span>
          </td>
          <td className="px-4 py-4">
            <StatusBadge status="available" />
          </td>
          {/* Action buttons — visible only on row hover */}
          <td className="px-4 py-4">
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100
                            transition-opacity duration-150">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-text-secondary hover:bg-elevated hover:text-text-primary
                                 transition-colors duration-150">
                <LuPencil size={14} />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center
                                 text-text-secondary hover:bg-red-500/10 hover:text-red-400
                                 transition-colors duration-150">
                <LuTrash2 size={14} />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex items-center justify-between px-5 py-3 border-t border-border">
    <p className="text-xs text-text-secondary">
      Showing <span className="text-text-primary font-medium">1–10</span> of{' '}
      <span className="text-text-primary font-medium">48</span>
    </p>
    <div className="flex items-center gap-1">
      <button className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-text-secondary hover:bg-hover hover:text-text-primary
                         text-sm transition-colors duration-150 disabled:opacity-30">
        ←
      </button>
      {/* Active page */}
      <button className="w-8 h-8 rounded-lg bg-primary text-canvas text-sm font-semibold">
        1
      </button>
      {/* Inactive page */}
      <button className="w-8 h-8 rounded-lg text-text-secondary hover:bg-hover
                         hover:text-text-primary text-sm transition-colors duration-150">
        2
      </button>
      <button className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-text-secondary hover:bg-hover hover:text-text-primary
                         text-sm transition-colors duration-150">
        →
      </button>
    </div>
  </div>

</div>
```

**Column content rules:**

| Column type | Classes to apply |
|------------|-----------------|
| Registration / Trip / Delivery number | `font-mono text-sm font-medium text-text-secondary` |
| Primary name (vehicle model, driver name) | `text-sm font-medium text-text-primary` |
| Status column | `<StatusBadge status={...} />` always |
| Date / timestamp | `text-sm text-text-secondary` |
| Numeric (distance, weight) | `text-sm text-text-primary tabular-nums` |
| Secondary info (type, fuel) | `text-sm text-text-secondary capitalize` |

### 6.6 Buttons

```jsx
{/* Primary — main CTA */}
<button className="flex items-center gap-2 bg-primary hover:bg-primary-hover
                   text-canvas text-sm font-semibold px-4 py-2 rounded-lg
                   transition-colors duration-150 active:scale-95">
  <LuPlus size={16} /> Add Vehicle
</button>

{/* Secondary — edit, view */}
<button className="flex items-center gap-2 bg-elevated border border-border
                   text-text-primary text-sm font-semibold px-4 py-2 rounded-lg
                   hover:bg-hover transition-colors duration-150 active:scale-95">
  <LuPencil size={16} /> Edit
</button>

{/* Danger — delete */}
<button className="flex items-center gap-2 bg-red-500/10 border border-red-500/25
                   text-red-400 text-sm font-semibold px-4 py-2 rounded-lg
                   hover:bg-red-500/20 transition-colors duration-150 active:scale-95">
  <LuTrash2 size={16} /> Delete
</button>

{/* Ghost — cancel, close */}
<button className="text-text-secondary text-sm font-semibold px-4 py-2 rounded-lg
                   hover:bg-hover hover:text-text-primary
                   transition-colors duration-150 active:scale-95">
  Cancel
</button>

{/* Icon-only */}
<button className="w-9 h-9 rounded-lg flex items-center justify-center
                   text-text-secondary hover:bg-hover hover:text-text-primary
                   transition-colors duration-150">
  <LuX size={18} />
</button>

{/* Small variant — add sm sizing */}
{/* append: text-xs px-3 py-1.5 */}

{/* Large variant */}
{/* append: text-base px-6 py-3 */}
```

### 6.7 Form Inputs

```jsx
{/* Form group */}
<div className="flex flex-col gap-1.5">

  {/* Label */}
  <label className="text-sm font-semibold text-text-secondary">
    Registration Number
    <span className="text-red-400 ml-0.5">*</span>
  </label>

  {/* Text input */}
  <input
    className="w-full bg-elevated border border-border rounded-lg px-4 py-2
               text-base text-text-primary placeholder:text-text-tertiary
               focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
               transition-all duration-150"
    placeholder="e.g. MH12AB3456"
  />

  {/* Select */}
  <select className="w-full bg-elevated border border-border rounded-lg px-4 py-2
                     text-base text-text-primary
                     focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                     transition-all duration-150 cursor-pointer appearance-none">
    <option value="">Select type</option>
  </select>

  {/* Error state — replace border class */}
  {/* border-red-500 focus:border-red-500 focus:ring-red-500/20 */}

  {/* Error message */}
  <p className="text-xs text-red-400">Registration number is required.</p>

</div>

{/* Spacing between form groups */}
{/* Use gap-5 on the form's flex-col container */}
```

### 6.8 Modal

```jsx
{/* Overlay */}
<div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50
                flex items-center justify-center p-6
                animate-in fade-in duration-200">

  {/* Panel */}
  <div className="bg-elevated border border-border rounded-2xl shadow-2xl
                  w-full max-w-lg
                  animate-in slide-in-from-bottom-3 fade-in duration-200">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
      <h2 className="font-display font-semibold text-xl text-text-primary">
        Add Vehicle
      </h2>
      <button className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-text-secondary hover:bg-hover hover:text-text-primary
                         transition-colors duration-150">
        <LuX size={18} />
      </button>
    </div>

    {/* Body */}
    <div className="px-6 py-5 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
      {/* Form fields go here */}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
      <button className="text-text-secondary text-sm font-semibold px-4 py-2 rounded-lg
                         hover:bg-hover transition-colors duration-150">
        Cancel
      </button>
      <button className="bg-primary hover:bg-primary-hover text-canvas text-sm font-semibold
                         px-5 py-2 rounded-lg transition-colors duration-150 active:scale-95">
        Save Vehicle
      </button>
    </div>

  </div>
</div>

{/* Confirm / Delete modal — narrower */}
{/* max-w-sm, danger button in footer */}
```

Install `tailwindcss-animate` for modal animations:
```bash
npm install tailwindcss-animate
```
```js
// tailwind.config.js plugins
plugins: [require('tailwindcss-animate')]
```

### 6.9 Compliance Alert Card

```jsx
// daysLeft prop drives the color variant

// < 7 days — critical
<div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20
                rounded-lg px-4 py-3">
  <LuAlertTriangle className="text-red-400 shrink-0" size={16} />
  <p className="text-sm font-medium text-red-400">
    <span className="font-mono">MH12AB3456</span>
    {' '}— Insurance expires in <strong>6 days</strong>
  </p>
</div>

// 7–15 days — warning
<div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20
                rounded-lg px-4 py-3">
  <LuAlertTriangle className="text-amber-400 shrink-0" size={16} />
  <p className="text-sm font-medium text-amber-400">
    <span className="font-mono">KA05CD7890</span>
    {' '}— Fitness certificate expires in <strong>12 days</strong>
  </p>
</div>

// 15–30 days — informational
<div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20
                rounded-lg px-4 py-3">
  <LuAlertTriangle className="text-blue-400 shrink-0" size={16} />
  <p className="text-sm font-medium text-blue-400">
    <span className="font-mono">TN09EF1234</span>
    {' '}— Permit expires in <strong>28 days</strong>
  </p>
</div>
```

### 6.10 Toast Notification

```jsx
{/* Position wrapper — fixed, bottom-right */}
<div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80">

  {/* Success toast */}
  <div className="bg-elevated border border-border rounded-xl shadow-2xl
                  flex items-start gap-3 p-4 border-l-4 border-l-green-500
                  animate-in slide-in-from-right-4 fade-in duration-300">
    <LuCheckCircle className="text-green-400 shrink-0 mt-0.5" size={18} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-text-primary">Vehicle Added</p>
      <p className="text-xs text-text-secondary mt-0.5">MH12AB3456 has been created.</p>
    </div>
    <button className="text-text-tertiary hover:text-text-secondary">
      <LuX size={14} />
    </button>
  </div>

  {/* Error toast — replace border-l-green-500 with border-l-red-500, icon with LuXCircle text-red-400 */}
  {/* Warning toast — border-l-amber-500, icon LuAlertTriangle text-amber-400 */}

</div>
```

---

## 7. Page-Level Layouts

### 7.1 Dashboard Page

```jsx
<div className="flex flex-col gap-6">

  {/* Page header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="font-display font-bold text-3xl text-text-primary">Dashboard</h1>
      <p className="text-sm text-text-secondary mt-1">Good morning, John 👋</p>
    </div>
    <span className="text-xs text-text-secondary bg-elevated border border-border
                     rounded-lg px-3 py-2">
      Sun, 24 May 2026
    </span>
  </div>

  {/* KPI cards — 4 columns */}
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {/* <KPICard /> × 4 */}
  </div>

  {/* Charts row — 60/40 split */}
  <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
    <div className="xl:col-span-3 bg-surface border border-border rounded-xl p-6">
      {/* Monthly Delivery Bar Chart */}
      <h2 className="font-display font-semibold text-lg text-text-primary mb-5">
        Monthly Deliveries
      </h2>
    </div>
    <div className="xl:col-span-2 bg-surface border border-border rounded-xl p-6">
      {/* Fleet Donut Chart */}
      <h2 className="font-display font-semibold text-lg text-text-primary mb-5">
        Fleet Status
      </h2>
    </div>
  </div>

  {/* Bottom row — 65/35 split */}
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
    <div className="xl:col-span-2 bg-surface border border-border rounded-xl overflow-hidden">
      {/* Recent Trips mini-table */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-lg text-text-primary">Recent Trips</h2>
      </div>
    </div>
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Compliance Alerts */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-display font-semibold text-lg text-text-primary">
          Compliance Alerts
        </h2>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {/* <ComplianceAlertCard /> items */}
      </div>
    </div>
  </div>

</div>
```

### 7.2 List Pages (Vehicles / Drivers / Trips / Deliveries)

```jsx
<div className="flex flex-col gap-5">

  {/* Page header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <h1 className="font-display font-bold text-3xl text-text-primary">Vehicles</h1>
      <span className="bg-primary-muted text-primary text-xs font-bold
                       px-2.5 py-1 rounded-full">
        48
      </span>
    </div>
    <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover
                       text-canvas text-sm font-semibold px-4 py-2 rounded-lg
                       transition-colors duration-150 active:scale-95">
      <LuPlus size={16} /> Add Vehicle
    </button>
  </div>

  {/* Data table with built-in filter bar */}
  {/* <VehicleTable /> */}

</div>
```

### 7.3 Login Page

```jsx
<div className="min-h-screen bg-canvas flex">

  {/* Left brand panel */}
  <div className="hidden lg:flex flex-1 flex-col justify-between p-12
                  bg-surface border-r border-border relative overflow-hidden">

    {/* Blueprint dot grid background */}
    <div className="absolute inset-0 opacity-40"
         style={{
           backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
           backgroundSize: '32px 32px'
         }} />

    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-16">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <LuTruck className="text-canvas" size={22} />
        </div>
        <span className="font-display font-bold text-2xl text-text-primary">
          TransportFlow
        </span>
      </div>
      <h2 className="font-display font-bold text-5xl text-text-primary leading-tight mb-4">
        Logistics<br />Command<br />Centre
      </h2>
      <p className="text-text-secondary text-base max-w-xs">
        Full-stack transport management for manufacturing operations.
        Track every vehicle, driver, and delivery in real time.
      </p>
    </div>

    <p className="relative z-10 text-xs text-text-tertiary">
      © 2026 TransportFlow. All rights reserved.
    </p>
  </div>

  {/* Right login panel */}
  <div className="flex-1 lg:max-w-md flex items-center justify-center p-8">
    <div className="w-full max-w-sm">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <LuTruck className="text-canvas" size={16} />
        </div>
        <span className="font-display font-bold text-xl text-text-primary">TransportFlow</span>
      </div>

      <h1 className="font-display font-bold text-3xl text-text-primary mb-1">Welcome back</h1>
      <p className="text-sm text-text-secondary mb-8">Sign in to your account</p>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-secondary">Email</label>
          <input
            type="email"
            className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5
                       text-base text-text-primary placeholder:text-text-tertiary
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                       transition-all duration-150"
            placeholder="admin@transport.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-secondary">Password</label>
          <input
            type="password"
            className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5
                       text-base text-text-primary placeholder:text-text-tertiary
                       focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                       transition-all duration-150"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-canvas font-semibold
                     py-3 rounded-lg text-base transition-colors duration-150 active:scale-[0.98] mt-2">
          Sign In
        </button>
      </form>
    </div>
  </div>

</div>
```

---

## 8. Charts (Recharts + Tailwind Tokens)

Since Recharts uses props not CSS classes, use these exact hex values (matching the Tailwind config):

```jsx
// globals — import and reuse in every chart
const C = {
  primary:   '#f97316',
  success:   '#22c55e',
  warning:   '#f59e0b',
  danger:    '#ef4444',
  info:      '#3b82f6',
  neutral:   '#6b7280',
  cyan:      '#06b6d4',
  purple:    '#8b5cf6',
  textSub:   '#8b92a5',
  gridLine:  '#2a3040',
  tooltipBg: '#1e2330',
  tooltipBorder: '#2a3040',
};
```

**Chart container wrapper:**

```jsx
<div className="bg-surface border border-border rounded-xl p-6">
  <h2 className="font-display font-semibold text-lg text-text-primary mb-5">
    Monthly Deliveries
  </h2>
  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={data} barCategoryGap="35%">
      <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} vertical={false} />
      <XAxis dataKey="month" tick={{ fill: C.textSub, fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: C.textSub, fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={{ background: C.tooltipBg, border: `1px solid ${C.tooltipBorder}`, borderRadius: 8 }}
        labelStyle={{ color: '#f0f2f7', fontWeight: 600 }}
        itemStyle={{ color: C.textSub }}
        cursor={{ fill: 'rgba(249,115,22,0.06)' }}
      />
      <Bar dataKey="deliveries" fill={C.primary} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>
```

**Fleet Donut Chart colors:** `available → C.success`, `in-transit → C.warning`, `maintenance → C.danger`, `retired → C.neutral`

---

## 9. Icons Reference (react-icons/lu)

Install: `npm install react-icons`

| Element | Icon name | Size class |
|---------|-----------|------------|
| Dashboard nav | `LuLayoutDashboard` | `size={18}` |
| Vehicles nav | `LuTruck` | `size={18}` |
| Drivers nav | `LuUsers` | `size={18}` |
| Trips nav | `LuRoute` | `size={18}` |
| Deliveries nav | `LuPackage` | `size={18}` |
| Settings nav | `LuSettings` | `size={18}` |
| Add button | `LuPlus` | `size={16}` |
| Edit button | `LuPencil` | `size={14}` |
| Delete button | `LuTrash2` | `size={14}` |
| View / Eye | `LuEye` | `size={14}` |
| Search | `LuSearch` | `size={14}` |
| Filter | `LuSlidersHorizontal` | `size={16}` |
| Alert | `LuAlertTriangle` | `size={16}` |
| Close | `LuX` | `size={18}` |
| Logout | `LuLogOut` | `size={16}` |
| Location | `LuMapPin` | `size={14}` |
| Calendar | `LuCalendar` | `size={14}` |
| Clock | `LuClock` | `size={14}` |
| Phone | `LuPhone` | `size={14}` |
| Bell | `LuBell` | `size={18}` |
| Success check | `LuCheckCircle` | `size={18}` |
| KPI vehicles | `LuTruck` | `size={20}` |
| KPI drivers | `LuUsers` | `size={20}` |
| KPI trips | `LuRoute` | `size={20}` |
| KPI deliveries | `LuPackage` | `size={20}` |

---

## 10. Animations

Install `tailwindcss-animate` and add to config plugins. Then use these classes:

| Animation | Tailwind class |
|-----------|---------------|
| Modal entrance | `animate-in slide-in-from-bottom-3 fade-in duration-200` |
| Modal overlay | `animate-in fade-in duration-200` |
| Toast slide in | `animate-in slide-in-from-right-4 fade-in duration-300` |
| Page fade in | `animate-in fade-in duration-300` |
| Dropdown open | `animate-in slide-in-from-top-1 fade-in duration-150` |

**All hover/focus transitions use:** `transition-colors duration-150`
**Button press:** `active:scale-95` or `active:scale-[0.98]`
**No animation should exceed 300ms.**

### Skeleton Loader

```jsx
{/* Skeleton row inside a table */}
<tr className="border-b border-border">
  <td className="px-4 py-4">
    <div className="h-4 bg-elevated rounded animate-pulse w-28" />
  </td>
  <td className="px-4 py-4">
    <div className="h-4 bg-elevated rounded animate-pulse w-40" />
  </td>
  <td className="px-4 py-4">
    <div className="h-5 bg-elevated rounded-full animate-pulse w-20" />
  </td>
</tr>
```

---

## 11. Responsive Rules

| Breakpoint | Tailwind prefix | Behavior |
|-----------|----------------|----------|
| Mobile `< 768px` | (default) | Sidebar hidden, hamburger menu, stacked layout |
| Tablet `768px+` | `md:` | Sidebar icon-only (w-16), table horizontal scroll |
| Laptop `1024px+` | `lg:` | Full sidebar shown |
| Desktop `1280px+` | `xl:` | Full dashboard grid (4-col KPIs, 2-col charts) |

**Sidebar responsive:**
```jsx
{/* Hidden on mobile, shown on lg+ */}
<aside className="hidden lg:flex w-60 ...">
```

**KPI grid responsive:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
```

**Tables on mobile:** Always wrap in `overflow-x-auto`. Never hide columns — let the user scroll.

---

## 12. Do's and Don'ts

### ✅ DO
- Use only Tailwind utility classes for all styling
- Use the custom color names from `tailwind.config.js` (e.g. `bg-surface`, `text-text-secondary`)
- Use `font-mono` for every registration number, trip code, delivery number
- Use `<StatusBadge>` for every status value — never style status text directly
- Use `transition-colors duration-150` on every interactive element
- Use `animate-pulse` for all skeleton/loading states
- Use `active:scale-95` on all clickable buttons
- Wrap all table containers in `overflow-x-auto`

### ❌ DON'T
- Don't write any custom CSS (except the 4-line body reset in `index.css`)
- Don't use `style={{}}` inline styles for colors or spacing
- Don't use white (`bg-white`, `text-white`) anywhere
- Don't use `font-sans` — the body font is set globally to Barlow
- Don't use `bg-gray-*` or `text-gray-*` — use the custom `text-text-secondary` / `bg-elevated` tokens
- Don't add animations longer than `duration-300`
- Don't render status text outside of the `<StatusBadge>` component
- Don't use arbitrary Tailwind values (e.g. `w-[347px]`) — stick to the scale

---

*TransportFlow Design System v1.0 — Tailwind CSS Edition*
*All component implementations must reference this document.*