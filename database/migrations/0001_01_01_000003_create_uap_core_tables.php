<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username', 50)->unique();
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->string('country', 50)->default('Indonesia');
            $table->enum('role', ['user', 'admin'])->default('user');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->longText('description')->nullable();
            $table->string('genre', 50)->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('discount')->default(0);
            $table->string('image')->nullable();
            $table->boolean('is_free')->default(false);
            $table->date('release_date')->nullable();
            $table->string('developer', 100)->nullable();
            $table->string('publisher', 100)->nullable();
            $table->string('req_os', 150)->nullable();
            $table->string('req_processor', 200)->nullable();
            $table->string('req_memory', 50)->nullable();
            $table->string('req_graphics', 200)->nullable();
            $table->string('req_storage', 50)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('library', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->integer('hours_played')->default(0);
            $table->boolean('is_installed')->default(false);
            $table->boolean('is_favorite')->default(false);
            $table->timestamp('purchased_at')->useCurrent();
            $table->unique(['user_id', 'game_id']);
        });

        Schema::create('cart', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->timestamp('added_at')->useCurrent();
            $table->unique(['user_id', 'game_id']);
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('total', 10, 2);
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 10, 2);
        });

        Schema::create('friends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('friend_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['pending', 'accepted'])->default('pending');
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['user_id', 'friend_id']);
        });

        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('description', 255);
            $table->enum('rarity', ['Common', 'Rare', 'Epic', 'Legendary'])->default('Common');
        });

        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('achievement_id')->constrained()->cascadeOnDelete();
            $table->timestamp('unlocked_at')->useCurrent();
            $table->unique(['user_id', 'achievement_id']);
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->enum('category', ['General', 'Announcement', 'Game Discussion', 'Tech Support', 'Trading'])->default('General');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('post_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('rating');
            $table->text('content');
            $table->integer('helpful_count')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['user_id', 'game_id']);
        });

        Schema::create('guides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->integer('views')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 100);
            $table->string('email', 150);
            $table->string('category', 100);
            $table->text('message');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('support_articles', function (Blueprint $table) {
            $table->id();
            $table->string('category', 80);
            $table->string('title');
            $table->text('content');
            $table->unsignedInteger('views')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('game_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->string('filename');
            $table->integer('sort_order')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_images');
        Schema::dropIfExists('support_articles');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('guides');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('post_replies');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('user_achievements');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('friends');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('cart');
        Schema::dropIfExists('library');
        Schema::dropIfExists('games');
        Schema::dropIfExists('users');
    }
};
