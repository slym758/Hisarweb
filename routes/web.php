<?php

use App\Http\Controllers\FormSubmissionController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Site\CampaignController;
use App\Http\Controllers\Site\SiteContentController;
use App\Support\LocaleService;
use App\Support\PageContentService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Renders a static Inertia page WITH its admin-editable copy: the page's DB copy tree
// (locale-resolved) is passed as the `pageCopy` prop, which the frontend deep-merges over
// the page's inline COPY (usePageCopy). With no DB rows the prop is [] and the page renders
// from its inline COPY unchanged. Used in place of Route::inertia for the static pages.
if (! function_exists('site_page')) {
    function site_page(string $uri, string $component): void
    {
        $slug = str_replace('site/', '', $component);
        // Cast to object so an ABSENT page yields JSON `{}` (not `[]`): the frontend
        // deep-merge treats `{}` as "no override" and keeps the inline COPY, whereas an
        // empty JS array would replace it. Non-empty copy is unaffected (same JSON shape).
        Route::get($uri, fn () => Inertia::render($component, [
            'pageCopy' => (object) PageContentService::copyFor($slug, app()->getLocale()),
        ]));
    }
}

/*
| Public marketing site — bilingual. Turkish is served at the root; English under a
| `/en` prefix. Routes are registered in two groups (root + `/en`) rather than an
| optional `{locale?}` prefix param, because an optional prefix parameter before a
| static segment does not match reliably in Laravel. The SetLocale middleware resolves
| the active locale from the first URL segment. All internal links are locale-aware
| via `lp()` on the frontend, so route names are not needed here (except `home`, which
| the starter auth layouts reference). Detail routes go through SiteContentController,
| which loads the record from the DB (locale-resolved) and passes it as the `record`
| prop; an unknown slug/id yields a real 404 (firstOrFail). Locale groups are generated
| from the admin-managed `languages` table (see the loop at the bottom).
*/
$sitePages = function () {
    // Corporate
    site_page('/kurumsal', 'site/kurumsal');
    site_page('/vizyon-misyon', 'site/vizyon-misyon');
    site_page('/kalite-calismalari', 'site/kalite-calismalari');
    site_page('/web-ve-tibbi-yayin-kurulu', 'site/web-ve-tibbi-yayin-kurulu');
    site_page('/insan-kaynaklari', 'site/insan-kaynaklari');
    site_page('/gebe-okulu', 'site/gebe-okulu');
    Route::get('/moral-takimi', [SiteContentController::class, 'moralTeam']);
    site_page('/basinda-hastanemiz', 'site/basinda-hastanemiz');
    Route::get('/basinda-hastanemiz/{slug}', [SiteContentController::class, 'press']);
    site_page('/etkinlikler', 'site/etkinlikler');
    Route::get('/etkinlikler/{slug}', [SiteContentController::class, 'event']);

    // Medical index + detail
    site_page('/bolumlerimiz', 'site/bolumlerimiz');
    Route::get('/bolum/{slug}', [SiteContentController::class, 'department']);
    site_page('/doktorlarimiz', 'site/doktorlarimiz');
    Route::get('/doktor/{id}', [SiteContentController::class, 'doctor']);
    site_page('/hastaliklar', 'site/hastaliklar');
    Route::get('/hastalik/{slug}', [SiteContentController::class, 'disease']);
    site_page('/tedavi-yontemleri', 'site/tedavi-yontemleri');
    Route::get('/tedavi-yontemleri/{slug}', [SiteContentController::class, 'treatmentMethod']);
    Route::get('/tedavi/{slug}', [SiteContentController::class, 'treatment']);
    site_page('/teknolojilerimiz', 'site/teknolojilerimiz');
    Route::get('/teknoloji/{slug}', [SiteContentController::class, 'technology']);

    // Hospitals + oncology
    site_page('/hastanelerimiz', 'site/hastanelerimiz');
    Route::get('/hastane/{slug}', [SiteContentController::class, 'hospital']);
    site_page('/butunlesik-onkoloji', 'site/butunlesik-onkoloji');
    site_page('/butunlesik-onkoloji/medikal-kadro', 'site/butunlesik-onkoloji-medikal-kadro');

    // Guide / content
    site_page('/saglikli-hayat-rehberi', 'site/saglikli-hayat-rehberi');
    Route::get('/saglikli-hayat-rehberi/{slug}', fn () => Inertia::render('site/rehber-detay', ['slug' => request()->route('slug')]));
    site_page('/videolar', 'site/videolar');
    site_page('/bilgi-rehberi', 'site/bilgi-rehberi');
    site_page('/guvenli-cerrahi', 'site/guvenli-cerrahi');
    site_page('/paketler', 'site/paketler');
    Route::get('/paketler/{slug}', [SiteContentController::class, 'package']);
    site_page('/anlasmali-kurumlar', 'site/anlasmali-kurumlar');
    site_page('/mobil-uygulama', 'site/mobil-uygulama');

    // Campaigns — editor-created, time-boxed landing pages (medical-tourism / ad traffic)
    Route::get('/kampanya/{slug}', [CampaignController::class, 'show']);

    // Service / forms (prototype)
    site_page('/online-hizmetler', 'site/online-hizmetler');
    site_page('/doktora-sorun', 'site/doktora-sorun');
    site_page('/sizi-arayalim', 'site/sizi-arayalim');
    site_page('/sizi-dinliyoruz', 'site/sizi-dinliyoruz');
    site_page('/anketimize-katilin', 'site/anketimize-katilin');
    site_page('/iletisim', 'site/iletisim');

    // Legal
    site_page('/kvkk-politikamiz', 'site/kvkk-politikamiz');
    site_page('/bilgi-guvenligi-politikamiz', 'site/bilgi-guvenligi-politikamiz');
    site_page('/cerez-politikasi', 'site/cerez-politikasi');
    site_page('/mesafeli-satis-sozlesmesi', 'site/mesafeli-satis-sozlesmesi');
};

// Default locale (Turkish) at the root, no prefix. `home` is named for the starter
// auth layouts.
Route::get('/', fn () => Inertia::render('site/home'))->name('home');
Route::group([], $sitePages);

// One prefixed group per additional active locale (/en, /de, /ar…), resolved from the
// admin-managed `languages` table. NOTE: if you run `route:cache`, this list is frozen
// at cache time — run `php artisan route:clear` after adding/removing a language.
foreach (LocaleService::prefixed() as $locale) {
    Route::prefix($locale)->group(function () use ($sitePages, $locale) {
        Route::get('/', fn () => Inertia::render('site/home'))->name("home.$locale");
        $sitePages();
    });
}

// Public form submissions (contact, appointment, ask-a-doctor, …). Locale-agnostic, so
// it lives outside the localized groups; the active locale is carried in the payload.
// Throttled + honeypot-guarded (see FormSubmissionController) for spam protection.
Route::post('/form/{key}', [FormSubmissionController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('form.submit');

// DB-backed site search for the header overlay. Locale-agnostic (locale is a query param);
// returns JSON groups the frontend renders + localizes. Lives outside the localized groups.
Route::get('/api/search', [SearchController::class, 'index'])->name('search');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
