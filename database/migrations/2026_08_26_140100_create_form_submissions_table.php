<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A single public-form submission (the admin "inbox"). `payload` holds the submitted
 * fields as JSON (never the KVKK checkbox or honeypot). `consent_at` records the KVKK
 * explicit-consent timestamp (KVKK compliance). `ip`/`user_agent` are kept for abuse
 * triage only. Additive — never wipes existing data.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_definition_id')->nullable()->constrained()->nullOnDelete();
            $table->string('key');
            $table->json('payload');
            $table->string('locale');
            $table->timestamp('consent_at')->nullable();
            $table->string('ip')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('status')->default('new');
            $table->timestamps();

            $table->index('key');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_submissions');
    }
};
