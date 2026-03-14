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
        Schema::create('archived_documents', function (Blueprint $table) {
            $table->id();
            $table->string('foreign_proponents_id');
            $table->foreign('foreign_proponents_id')->references('proponents_id')->on('proponents')->onDelete('cascade');
            $table->string('title_name');
            $table->string('original_name');
            $table->string('stored_name');      
            $table->string('path');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size');
            $table->integer(column: 'version')->default(1);
            $table->date('passed_date')->nullable();
            $table->date('archived_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archived_documents');
    }
};
