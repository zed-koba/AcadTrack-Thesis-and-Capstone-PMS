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
        
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('foreign_proponents_id')->nullable();
            $table->foreign('foreign_proponents_id')->references('proponents_id')->on('proponents')->onDelete('cascade');
            $table->foreignId('adviser_id')->constrained()->nullable()->cascadeOnDelete();
            $table->foreignId('instructor_id')->constrained()->nullable()->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->string('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
