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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('student_id', 20)->unique();
            $table->foreignId('department_id')->nullable()->constrained();
            $table->foreignId('program_id')->nullable()->constrained();
            $table->string('section');
            $table->string('mobile_num')->nullable();
            $table->integer('semester');
            $table->string('facebook_profile')->nullable();
            $table->integer('year_level');
            $table->string('thesis_title')->nullable();
            $table->foreignId('role_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
