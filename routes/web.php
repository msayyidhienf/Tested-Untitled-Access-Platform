<?php

use App\Http\Controllers\Admin\AchievementController as AdminAchievementController;
use App\Http\Controllers\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GameController as AdminGameController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\TicketController as AdminTicketController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\WalletController as AdminWalletController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\MidtransNotificationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SupportArticleController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/store')->name('home');

Route::post('/midtrans/notification', [MidtransNotificationController::class, 'handle'])->name('midtrans.notification');

Route::get('/store', [GameController::class, 'index'])->name('store.index');
Route::get('/game/{game}', [GameController::class, 'show'])->name('store.show');

Route::get('/community', [PostController::class, 'index'])->name('community.index');
Route::get('/community/reviews', [ReviewController::class, 'index'])->name('community.reviews');
Route::get('/community/guides', [GuideController::class, 'index'])->name('community.guides');

Route::get('/support', [SupportArticleController::class, 'index'])->name('support.index');
Route::get('/support/faq', function () {
    return Inertia::render('support/faq');
})->name('support.faq');
Route::get('/support/refund', function () {
    return Inertia::render('support/refund');
})->name('support.refund');
Route::get('/support/contact', [SupportTicketController::class, 'create'])->name('support.contact');
Route::post('/support/contact', [SupportTicketController::class, 'store'])->name('support.contact.store');
Route::get('/support/articles', [SupportArticleController::class, 'byCategory'])->name('support.articles');
Route::get('/support/articles/{article}', [SupportArticleController::class, 'show'])->name('support.article');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add/{game}', [CartController::class, 'store'])->name('cart.add');
    Route::delete('/cart/{game}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');

    Route::get('/library', [LibraryController::class, 'index'])->name('library.index');
    Route::post('/library/favorite/{game}', [LibraryController::class, 'toggleFavorite'])->name('library.toggleFavorite');

    Route::post('/community/posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('/community/posts/{post}/replies', [PostController::class, 'storeReply'])->name('posts.replies.store');
    Route::post('/community/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.readAll');

    Route::get('/wallet', [WalletController::class, 'index'])->name('wallet.index');
    Route::post('/wallet/topup', [WalletController::class, 'topUp'])->name('wallet.topup');

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');
    Route::post('/friends/request/{user}', [FriendController::class, 'store'])->name('friends.request');
    Route::post('/friends/accept/{user}', [FriendController::class, 'accept'])->name('friends.accept');
    Route::post('/friends/decline/{user}', [FriendController::class, 'decline'])->name('friends.decline');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/games', [AdminGameController::class, 'index'])->name('games.index');
    Route::post('/games', [AdminGameController::class, 'store'])->name('games.store');
    Route::post('/games/{game}', [AdminGameController::class, 'update'])->name('games.update');
    Route::post('/games/{game}/delete', [AdminGameController::class, 'destroy'])->name('games.destroy');
    Route::post('/games/screenshots/delete', [AdminGameController::class, 'destroyScreenshot'])->name('games.screenshots.destroy');

    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.updateRole');
    Route::post('/users/{user}/delete', [AdminUserController::class, 'destroy'])->name('users.destroy');

    Route::get('/tickets', [AdminTicketController::class, 'index'])->name('tickets.index');
    Route::post('/tickets/{ticket}/status', [AdminTicketController::class, 'updateStatus'])->name('tickets.updateStatus');
    Route::post('/tickets/{ticket}/delete', [AdminTicketController::class, 'destroy'])->name('tickets.destroy');

    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::post('/orders/{order}/refund', [AdminOrderController::class, 'refund'])->name('orders.refund');

    Route::get('/wallets', [AdminWalletController::class, 'index'])->name('wallets.index');
    Route::post('/wallets/adjust', [AdminWalletController::class, 'adjust'])->name('wallets.adjust');

    Route::get('/achievements', [AdminAchievementController::class, 'index'])->name('achievements.index');
    Route::post('/achievements', [AdminAchievementController::class, 'store'])->name('achievements.store');
    Route::post('/achievements/{achievement}', [AdminAchievementController::class, 'update'])->name('achievements.update');
    Route::post('/achievements/{achievement}/delete', [AdminAchievementController::class, 'destroy'])->name('achievements.destroy');

    Route::get('/articles', [AdminArticleController::class, 'index'])->name('articles.index');
    Route::post('/articles', [AdminArticleController::class, 'store'])->name('articles.store');
    Route::post('/articles/{article}', [AdminArticleController::class, 'update'])->name('articles.update');
    Route::post('/articles/{article}/delete', [AdminArticleController::class, 'destroy'])->name('articles.destroy');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
