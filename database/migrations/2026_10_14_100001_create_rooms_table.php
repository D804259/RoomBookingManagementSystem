<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number', 32)->unique();
            $table->string('room_type', 64);
            $table->text('description');
            $table->decimal('price_per_night', 10, 2);
            $table->unsignedTinyInteger('capacity');
            $table->string('image')->nullable();
            $table->string('status', 32)->default('available');
            $table->timestamps();

            $table->index('room_type');
            $table->index('status');
            $table->index('price_per_night');
            $table->index('capacity');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
