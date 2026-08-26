<?php

use App\Http\Controllers\FormSubmissionController;
use App\Http\Controllers\Site\SiteContentController;
use App\Support\LocaleService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::inertia('/kurumsal', 'site/kurumsal');
    Route::inertia('/vizyon-misyon', 'site/vizyon-misyon');
    Route::inertia('/kalite-calismalari', 'site/kalite-calismalari');
    Route::inertia('/web-ve-tibbi-yayin-kurulu', 'site/web-ve-tibbi-yayin-kurulu');
    Route::inertia('/insan-kaynaklari', 'site/insan-kaynaklari');
    Route::inertia('/gebe-okulu', 'site/gebe-okulu');
    Route::inertia('/moral-takimi', 'site/moral-takimi');
    Route::inertia('/basinda-hastanemiz', 'site/basinda-hastanemiz');
    Route::get('/basinda-hastanemiz/{slug}', [SiteContentController::class, 'press']);
    Route::inertia('/etkinlikler', 'site/etkinlikler');
    Route::get('/etkinlikler/{slug}', [SiteContentController::class, 'event']);

    // Medical index + detail
    Route::inertia('/bolumlerimiz', 'site/bolumlerimiz');
    Route::get('/bolum/{slug}', [SiteContentController::class, 'department']);
    Route::inertia('/doktorlarimiz', 'site/doktorlarimiz');
    Route::get('/doktor/{id}', [SiteContentController::class, 'doctor']);
    Route::inertia('/hastaliklar', 'site/hastaliklar');
    Route::get('/hastalik/{slug}', [SiteContentController::class, 'disease']);
    Route::inertia('/tedavi-yontemleri', 'site/tedavi-yontemleri');
    Route::get('/tedavi-yontemleri/{slug}', [SiteContentController::class, 'treatmentMethod']);
    Route::get('/tedavi/{slug}', [SiteContentController::class, 'treatment']);
    Route::inertia('/teknolojilerimiz', 'site/teknolojilerimiz');
    Route::get('/teknoloji/{slug}', [SiteContentController::class, 'technology']);

    // Hospitals + oncology
    Route::inertia('/hastanelerimiz', 'site/hastanelerimiz');
    Route::get('/hastane/{slug}', [SiteContentController::class, 'hospital']);
    Route::inertia('/butunlesik-onkoloji', 'site/butunlesik-onkoloji');
    Route::inertia('/butunlesik-onkoloji/medikal-kadro', 'site/butunlesik-onkoloji-medikal-kadro');

    // Guide / content
    Route::inertia('/saglikli-hayat-rehberi', 'site/saglikli-hayat-rehberi');
    Route::get('/saglikli-hayat-rehberi/{slug}', fn () => Inertia::render('site/rehber-detay', ['slug' => request()->route('slug')]));
    Route::inertia('/videolar', 'site/videolar');
    Route::inertia('/bilgi-rehberi', 'site/bilgi-rehberi');
    Route::inertia('/guvenli-cerrahi', 'site/guvenli-cerrahi');
    Route::inertia('/paketler', 'site/paketler');
    Route::get('/paketler/{slug}', [SiteContentController::class, 'package']);
    Route::inertia('/anlasmali-kurumlar', 'site/anlasmali-kurumlar');
    Route::inertia('/mobil-uygulama', 'site/mobil-uygulama');

    // Service / forms (prototype)
    Route::inertia('/online-hizmetler', 'site/online-hizmetler');
    Route::inertia('/randevu-al', 'site/randevu-al');
    Route::inertia('/doktora-sorun', 'site/doktora-sorun');
    Route::inertia('/sizi-arayalim', 'site/sizi-arayalim');
    Route::inertia('/sizi-dinliyoruz', 'site/sizi-dinliyoruz');
    Route::inertia('/anketimize-katilin', 'site/anketimize-katilin');
    Route::inertia('/iletisim', 'site/iletisim');

    // Legal
    Route::inertia('/kvkk-politikamiz', 'site/kvkk-politikamiz');
    Route::inertia('/bilgi-guvenligi-politikamiz', 'site/bilgi-guvenligi-politikamiz');
    Route::inertia('/cerez-politikasi', 'site/cerez-politikasi');
    Route::inertia('/mesafeli-satis-sozlesmesi', 'site/mesafeli-satis-sozlesmesi');
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

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
