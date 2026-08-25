<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
| Public marketing site — bilingual. Turkish is served at the root; English under a
| `/en` prefix. Routes are registered in two groups (root + `/en`) rather than an
| optional `{locale?}` prefix param, because an optional prefix parameter before a
| static segment does not match reliably in Laravel. The SetLocale middleware resolves
| the active locale from the first URL segment. All internal links are locale-aware
| via `lp()` on the frontend, so route names are not needed here (except `home`, which
| the starter auth layouts reference). Dynamic detail routes pass the slug/id to the
| Inertia page, which resolves it against the content-data layer and renders a
| not-found state for unknown slugs (a true 404 status arrives with the DB migration).
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
    Route::get('/basinda-hastanemiz/{slug}', fn () => Inertia::render('site/basin-detay', ['slug' => request()->route('slug')]));
    Route::inertia('/etkinlikler', 'site/etkinlikler');
    Route::get('/etkinlikler/{slug}', fn () => Inertia::render('site/etkinlik-detay', ['slug' => request()->route('slug')]));

    // Medical index + detail
    Route::inertia('/bolumlerimiz', 'site/bolumlerimiz');
    Route::get('/bolum/{slug}', fn () => Inertia::render('site/bolum-detay', ['slug' => request()->route('slug')]));
    Route::inertia('/doktorlarimiz', 'site/doktorlarimiz');
    Route::get('/doktor/{id}', fn () => Inertia::render('site/doktor-detay', ['id' => request()->route('id')]));
    Route::inertia('/hastaliklar', 'site/hastaliklar');
    Route::get('/hastalik/{slug}', fn () => Inertia::render('site/hastalik-detay', ['slug' => request()->route('slug')]));
    Route::inertia('/tedavi-yontemleri', 'site/tedavi-yontemleri');
    Route::get('/tedavi-yontemleri/{slug}', fn () => Inertia::render('site/tedavi-yontemi-detay', ['slug' => request()->route('slug')]));
    Route::get('/tedavi/{slug}', fn () => Inertia::render('site/tedavi-detay', ['slug' => request()->route('slug')]));
    Route::inertia('/teknolojilerimiz', 'site/teknolojilerimiz');
    Route::get('/teknoloji/{slug}', fn () => Inertia::render('site/teknoloji-detay', ['slug' => request()->route('slug')]));

    // Hospitals + oncology
    Route::inertia('/hastanelerimiz', 'site/hastanelerimiz');
    Route::get('/hastane/{slug}', fn () => Inertia::render('site/hastane-detay', ['slug' => request()->route('slug')]));
    Route::inertia('/butunlesik-onkoloji', 'site/butunlesik-onkoloji');
    Route::inertia('/butunlesik-onkoloji/medikal-kadro', 'site/butunlesik-onkoloji-medikal-kadro');

    // Guide / content
    Route::inertia('/saglikli-hayat-rehberi', 'site/saglikli-hayat-rehberi');
    Route::get('/saglikli-hayat-rehberi/{slug}', fn () => Inertia::render('site/rehber-detay', ['slug' => request()->route('slug')]));
    Route::inertia('/videolar', 'site/videolar');
    Route::inertia('/bilgi-rehberi', 'site/bilgi-rehberi');
    Route::inertia('/guvenli-cerrahi', 'site/guvenli-cerrahi');
    Route::inertia('/paketler', 'site/paketler');
    Route::get('/paketler/{slug}', fn () => Inertia::render('site/paket-detay', ['slug' => request()->route('slug')]));
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

// Home (named for the starter auth layouts) + the rest, both locales.
Route::get('/', fn () => Inertia::render('site/home'))->name('home');
Route::group([], $sitePages);

Route::prefix('en')->group(function () use ($sitePages) {
    Route::get('/', fn () => Inertia::render('site/home'))->name('home.en');
    $sitePages();
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
