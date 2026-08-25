/**
 * Exports the dummy content catalog from `site-data.ts` to JSON for the Laravel seeder
 * (SiteCatalogSeeder). For each entity it emits the fully-resolved `tr` and `en` records
 * (same order), merging the separate detail objects into departments/hospitals and
 * converting the lucide `icon` component to its name string. Run via esbuild bundle:
 *
 *   esbuild scripts/export-catalog.ts --bundle --platform=node --format=esm \
 *     --alias:@/lib/i18n=./scripts/i18n-stub.ts --alias:@=./resources/js \
 *     --outfile=scripts/.export-catalog.mjs && node scripts/.export-catalog.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import * as SD from '@/lib/site-data';

type L = 'tr' | 'en';

function iconName(icon: unknown): string | null {
    const c = icon as { displayName?: string; render?: { displayName?: string }; name?: string } | null;
    return c?.displayName ?? c?.render?.displayName ?? c?.name ?? null;
}

function departments(l: L) {
    return SD.getDepartments(l).map((d) => {
        const detail = SD.getDepartmentDetail(d.slug, l);
        return {
            ...d,
            icon: iconName((d as { icon?: unknown }).icon),
            about: detail?.about ?? null,
            technologies: detail?.technologies ?? null,
        };
    });
}

function hospitals(l: L) {
    return SD.getHospitals(l).map((h) => {
        const detail = SD.getHospitalDetail(h.slug, l);
        return { ...h, ...(detail ?? {}) };
    });
}

const out = {
    departments: { tr: departments('tr'), en: departments('en') },
    hospitals: { tr: hospitals('tr'), en: hospitals('en') },
    doctors: { tr: SD.getDoctors('tr'), en: SD.getDoctors('en') },
    diseases: { tr: SD.getDiseases('tr'), en: SD.getDiseases('en') },
    treatments: { tr: SD.getTreatments('tr'), en: SD.getTreatments('en') },
    technologies: { tr: SD.getTechnologies('tr'), en: SD.getTechnologies('en') },
    blogPosts: { tr: SD.getBlogPosts('tr'), en: SD.getBlogPosts('en') },
    videos: { tr: SD.getVideos('tr'), en: SD.getVideos('en') },
    events: { tr: SD.getEvents('tr'), en: SD.getEvents('en') },
    packages: { tr: SD.getPackages('tr'), en: SD.getPackages('en') },
    press: { tr: SD.getPress('tr'), en: SD.getPress('en') },
    faq: { tr: SD.getFaq('tr'), en: SD.getFaq('en') },
    symptomMap: { tr: SD.getSymptomMap('tr'), en: SD.getSymptomMap('en') },
};

const target = 'database/seeders/data/site-catalog.json';
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(out, null, 2)}\n`);

console.log('Wrote', target);
for (const [key, val] of Object.entries(out)) {
    console.log(`  ${key}: ${(val as { tr: unknown[] }).tr.length}`);
}
