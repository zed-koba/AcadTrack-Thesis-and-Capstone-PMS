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
        Schema::create('adviser_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('adviser_id')->constrained()->cascadeOnDelete();
            $table->time('start_time');
            $table->time('end_time');
            $table->string('day');
            $table->boolean('is_available')->default(true);
            $table->timestamps();
            $table->unique(
        ['adviser_id', 'day','start_time', 'end_time'],
        'unique_adviser_time_slot'
    );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adviser_availabilities');
    }
};
