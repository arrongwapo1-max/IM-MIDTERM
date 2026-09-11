<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('concerns', function (Blueprint $table) {
            $table->string('audience')->default('Guidance Office')->after('category');
            $table->boolean('pinned')->default(false)->after('audience');
            $table->string('attachment_path')->nullable()->after('pinned');
            $table->string('attachment_name')->nullable()->after('attachment_path');
            $table->string('attachment_mime')->nullable()->after('attachment_name');
        });
    }

    public function down(): void
    {
        Schema::table('concerns', function (Blueprint $table) {
            $table->dropColumn(['audience', 'pinned', 'attachment_path', 'attachment_name', 'attachment_mime']);
        });
    }
};