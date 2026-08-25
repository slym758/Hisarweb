<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\Translatable\Translatable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Çevrilebilir alanlarda aktif dil değeri boşsa TR'ye düş (site doktrini:
        // EN eksikse TR fallback). spatie/laravel-translatable v6'da config dosyası
        // yok; fallback singleton üzerinden ayarlanır.
        app(Translatable::class)->fallback(fallbackLocale: 'tr');
    }
}
