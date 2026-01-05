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
        Schema::create('proponents_details', function (Blueprint $table) {
            $table->id('propsdetails_id');
            $table->string('foreign_proponents_id');
            $table->foreign('foreign_proponents_id')->references('proponents_id')->on('proponents')->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proponents_details');
    }
};
