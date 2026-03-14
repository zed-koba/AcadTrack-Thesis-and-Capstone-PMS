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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('original_name');       
            $table->string('title_name');
            $table->string('stored_name');
            $table->enum('status', ['pending', 'under review', 'need revision', 'approved', 'revised', 'passed'])->default('pending');
            $table->string('path');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size');
            $table->foreignId('parent_document_id')
                ->nullable()
                ->constrained('documents')
                ->cascadeOnDelete();
            $table->integer('version')->default(1);
            $table->date('approved_date')->nullable();
            $table->date('passed_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
