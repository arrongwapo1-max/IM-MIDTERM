<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email')->unique();
            $table->unsignedTinyInteger('age');
            $table->string('course', 100);
            $table->unsignedTinyInteger('year_level');
            $table->enum('status', ['active', 'inactive']);
            $table->timestamps();

            $table->index(['course', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};