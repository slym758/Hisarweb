// Export each static page's inline `const COPY = { tr, en }` literal into a seedable
// JSON catalog (database/seeders/data/page-copy.json), so editors can later edit the
// text from the admin (see PageCopySeeder + usePageCopy). Pure, additive tooling:
// it only READS the page files. Any function values in COPY (typed arrow fns) are
// intentionally dropped by the JSON round-trip — they stay in the inline COPY fallback.
//
// Run (in container):  warden env exec php-fpm node scripts/export-page-copy.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_DIR = resolve(ROOT, 'resources/js/pages/site');
const OUT_FILE = resolve(ROOT, 'database/seeders/data/page-copy.json');

// The 34 static pages whose inline COPY becomes admin-editable. slug === filename.
const SLUGS = [
    'anketimize-katilin',
    'anlasmali-kurumlar',
    'basinda-hastanemiz',
    'bilgi-guvenligi-politikamiz',
    'bilgi-rehberi',
    'bolumlerimiz',
    'butunlesik-onkoloji',
    'butunlesik-onkoloji-medikal-kadro',
    'cerez-politikasi',
    'doktora-sorun',
    'doktorlarimiz',
    'etkinlikler',
    'gebe-okulu',
    'guvenli-cerrahi',
    'hastaliklar',
    'hastanelerimiz',
    'iletisim',
    'insan-kaynaklari',
    'kalite-calismalari',
    'kurumsal',
    'kvkk-politikamiz',
    'mesafeli-satis-sozlesmesi',
    'mobil-uygulama',
    'moral-takimi',
    'online-hizmetler',
    'paketler',
    'saglikli-hayat-rehberi',
    'sizi-arayalim',
    'sizi-dinliyoruz',
    'tedavi-yontemleri',
    'teknolojilerimiz',
    'videolar',
    'vizyon-misyon',
    'web-ve-tibbi-yayin-kurulu',
];

/**
 * Return the index of the `}` that matches the `{` at `open`, skipping over string
 * literals (', ", `) so braces inside text/`${...}` never miscount. Returns -1 if none.
 */
function matchBrace(src, open) {
    let depth = 0;
    let quote = null;
    for (let i = open; i < src.length; i++) {
        const ch = src[i];
        if (quote) {
            if (ch === '\\') {
                i++;
                continue;
            }
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === "'" || ch === '"' || ch === '`') {
            quote = ch;
            continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

/** Extract the `const COPY = { ... }` object literal (as TS source) from a file. */
function extractCopyLiteral(src) {
    const decl = src.indexOf('const COPY =');
    if (decl === -1) throw new Error('no `const COPY =` found');
    const open = src.indexOf('{', decl);
    if (open === -1) throw new Error('no `{` after `const COPY =`');
    const close = matchBrace(src, open);
    if (close === -1) throw new Error('unbalanced braces for COPY object');
    return src.slice(open, close + 1);
}

/** Transpile the TS object literal to JS and evaluate it to a plain object. */
function evalCopy(literal) {
    const { code } = transformSync('module.exports = (' + literal + ')', { loader: 'ts' });
    const module = { exports: {} };
    // eslint-disable-next-line no-new-func
    new Function('module', code)(module);
    // JSON round-trip drops functions (typed arrow fns) — intended: they stay inline.
    return JSON.parse(JSON.stringify(module.exports));
}

const out = {};
const skipped = [];
let ok = 0;

for (const slug of SLUGS) {
    const file = resolve(PAGES_DIR, `${slug}.tsx`);
    try {
        const src = readFileSync(file, 'utf8');
        const copy = evalCopy(extractCopyLiteral(src));
        if (!copy || typeof copy !== 'object' || !copy.tr || !copy.en) {
            throw new Error('COPY missing tr/en after eval');
        }
        out[slug] = { tr: copy.tr, en: copy.en };
        ok++;
    } catch (err) {
        skipped.push({ slug, reason: err.message });
        console.warn(`SKIP ${slug}: ${err.message}`);
    }
}

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + '\n', 'utf8');

console.log(`\nExported ${ok}/${SLUGS.length} pages -> ${OUT_FILE}`);
if (skipped.length) {
    console.log(`Skipped ${skipped.length}: ${skipped.map((s) => s.slug).join(', ')}`);
}
