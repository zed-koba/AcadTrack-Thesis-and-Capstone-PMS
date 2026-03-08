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
        Schema::create('development_processes', function (Blueprint $table) {
            $table->id();
            $table->string('foreign_proponents_id');
            $table->foreign('foreign_proponents_id')->references('proponents_id')->on('proponents')->onDelete('cascade');
            $table->string('feature');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('completed_date')->nullable();
            $table->date('checked_date')->nullable();
            $table->enum('status', ['not-started', 'overdue', 'completed', 'completed-late', 'checked', 'in-progress']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('development_processes');
    }
};
