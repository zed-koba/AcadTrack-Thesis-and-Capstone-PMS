<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('advisers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('account_id')->constrained()->cascadeOnDelete();
            $table->string('contact_number')->nullable();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['active', 'inactive'])->default('inactive');
            $table->integer('duration')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advisers');
    }
};
