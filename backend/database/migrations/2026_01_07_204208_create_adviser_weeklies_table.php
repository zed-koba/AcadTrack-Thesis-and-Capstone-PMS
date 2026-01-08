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
        Schema::create('adviser_weeklies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('adviser_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('day_of_week');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('purpose');
            $table->string('feedback')->nullable();
            $table->enum('status', ['pending', 'approved', 'completed', 'rejected'])->default('pending');
            $table->unique(['adviser_id', 'day_of_week', 'start_time', 'end_time'], 'unique_adviser_weekly_slot');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adviser_weeklies');
    }
};
