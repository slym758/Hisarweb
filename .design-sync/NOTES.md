# design-sync notes — Hisar Design System

Project: **Hisar Design System** (`57c8a6a5-df65-434b-ba10-db35d9c4a42f`) ·
https://claude.ai/design/p/57c8a6a5-df65-434b-ba10-db35d9c4a42f

This repo is a **Laravel + Inertia app**, not a standalone component package. It syncs in
**package shape** via a barrel entry — see the gotchas below before re-syncing.

## Setup gotchas (how to reproduce a build)
- **Barrel entry**: `.design-sync/entry.ts` re-exports every `resources/js/components/ui/*`
  so the converter has one stable `--entry`. Pass `--entry ./.design-sync/entry.ts`.
- **`package.json` needs `name`** (`"hisar-ui"`): without a named package.json the `.d.ts`
  prop-extractor walks past the repo root to `/` and crashes (`ENOENT /package.json`).
- **CSS is compiled, not raw**: `cssEntry` = `.design-sync/compiled/app.css`, produced by
  `cfg.buildCmd` (`npx @tailwindcss/cli@4 -i resources/css/app.css -o …`). Run buildCmd
  BEFORE the converter on every sync (the compiled file is gitignored). It's the full app
  utility set + tokens (light + `.dark`).
- **Render check uses system Chrome**: no matching Playwright browser is installed; run
  validate/capture with `DS_CHROMIUM_PATH=/bin/google-chrome`. Playwright JS was installed
  into `.ds-sync` with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` (cached chromium build is 1169,
  but the system google-chrome path is what we launch).

## Per-component notes
- **Toaster** = floor card by design. sonner renders toasts into a portal only after a
  `toast()` call, and a preview's separately-bundled `sonner` wouldn't share the DS bundle's
  toast store — so it can't render statically. Left honest; authorable later if wanted.
- **Sidebar** needs a preview viewport ≥ `md` (768px): it's `hidden md:block`. Override is
  `{cardMode:single, viewport:"840x460"}`. A narrow viewport renders it blank.
- Overlays (Dialog/Sheet/DropdownMenu/Popover/Tooltip) use `{cardMode:single, viewport:…}`
  and render open (`open` / provider) so the distinctive state shows in the card.

## Known render warns (triaged legitimate — not new issues)
- `[TOKENS_MISSING]`: `--font-sans--font-feature-settings`, `--font-mono--…`,
  `--radix-navigation-menu-viewport-{height,width}`, `--nav-h`. All are Tailwind-internal
  font vars or Radix/runtime-set vars — expected absent from static CSS. Non-blocking.

## Re-sync risks (watch these)
- **CSS coverage is bounded to what the app already uses.** The shipped `_ds_bundle.css`
  contains only Tailwind utilities scanned from existing repo sources. If the design agent
  writes NEW markup with a utility class the app never uses, it won't be styled. Improvement:
  add a Tailwind safelist / broader `@source` (or an `@source inline(...)`) so the shipped CSS
  covers more of the utility space. Re-run buildCmd after any such change.
- **Inter loads remotely at runtime** (Google Fonts `<link>` in `resources/views/app.blade.php`);
  `runtimeFontPrefixes:["Inter"]` suppresses `[FONT_MISSING]`. If Claude Design ever blocks
  remote fonts, previews fall back to system-ui — consider shipping Inter `.woff2` via
  `cfg.extraFonts` for full self-containment.
- **Preview content** (Turkish admin sample data) is inlined in `.design-sync/previews/*.tsx`
  (owned files) — fine, but it's representative dummy data, not from the app.
- **Scope**: only `resources/js/components/ui/*` is synced. The app's `site/` chrome and
  dashboard scaffolding are intentionally excluded (Inertia/i18n-coupled, not reusable DS).
