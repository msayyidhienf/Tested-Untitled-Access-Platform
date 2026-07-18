<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Game;
use App\Models\Library;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Notification;
use App\Models\WalletTransaction;
use App\Services\AchievementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $items = Cart::where('user_id', Auth::id())->with('game')->orderByDesc('added_at')->get();

        $total = $this->itemsTotal($items);

        return Inertia::render('cart/index', [
            'items' => $items,
            'total' => $total,
        ]);
    }

    public function store(Game $game): RedirectResponse
    {
        $userId = Auth::id();

        if (Library::where('user_id', $userId)->where('game_id', $game->id)->exists()) {
            return back()->with('error', "You already own \"{$game->title}\".");
        }

        $created = Cart::firstOrCreate([
            'user_id' => $userId,
            'game_id' => $game->id,
        ], [
            'added_at' => now(),
        ]);

        return back()->with('status', $created->wasRecentlyCreated ? "Added \"{$game->title}\" to your cart." : "\"{$game->title}\" is already in your cart.");
    }

    public function destroy(Game $game): RedirectResponse
    {
        Cart::where('user_id', Auth::id())->where('game_id', $game->id)->delete();

        return redirect()->route('cart.index')->with('status', "Removed \"{$game->title}\" from your cart.");
    }

    public function checkout(): RedirectResponse
    {
        $user = Auth::user();
        $userId = $user->id;
        $items = Cart::where('user_id', $userId)->with('game')->get();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty. Add a game before checking out.');
        }

        // Defensive re-check: a cart item may have been purchased through another
        // session/tab since it was added. Never charge twice for the same game.
        $ownedGameIds = Library::where('user_id', $userId)
            ->whereIn('game_id', $items->pluck('game_id'))
            ->pluck('game_id');

        if ($ownedGameIds->isNotEmpty()) {
            Cart::where('user_id', $userId)->whereIn('game_id', $ownedGameIds)->delete();
            $items = $items->whereNotIn('game_id', $ownedGameIds)->values();

            if ($items->isEmpty()) {
                return redirect()->route('cart.index')->with('error', 'The games in your cart were already in your library, so they were removed. Nothing was charged.');
            }
        }

        $total = $this->itemsTotal($items);

        if ($user->ucash_balance < $total) {
            return redirect()->route('cart.index')->with('error', 'Insufficient Ucash balance. Please top up first.');
        }

        DB::transaction(function () use ($user, $userId, $items, $total) {
            $order = Order::create([
                'user_id' => $userId,
                'total' => $total,
                'status' => 'paid',
            ]);

            foreach ($items as $item) {
                $price = $item->game->discount > 0
                    ? $item->game->price * (1 - $item->game->discount / 100)
                    : $item->game->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'game_id' => $item->game_id,
                    'price' => $price,
                ]);

                Library::firstOrCreate([
                    'user_id' => $userId,
                    'game_id' => $item->game_id,
                ], [
                    'purchased_at' => now(),
                ]);
            }

            $user->ucash_balance = $user->ucash_balance - $total;
            $user->save();

            WalletTransaction::create([
                'user_id' => $userId,
                'type' => 'purchase',
                'amount' => $total,
                'balance_after' => $user->ucash_balance,
                'description' => 'Checkout '.$items->count().' game'.($items->count() > 1 ? 's' : ''),
                'order_id' => $order->id,
            ]);

            Cart::where('user_id', $userId)->whereIn('game_id', $items->pluck('game_id'))->delete();

            Notification::create([
                'user_id' => $userId,
                'type' => 'purchase',
                'title' => 'Purchase Complete',
                'message' => 'You purchased '.$items->count().' game'.($items->count() > 1 ? 's' : '').' for Rp '.number_format($total, 0, ',', '.').'.',
                'link' => '/library',
            ]);
        });

        foreach (['games_owned', 'hours_played', 'sale_purchase', 'free_game_added'] as $type) {
            AchievementService::check($user, $type);
        }

        return redirect()->route('library.index')->with('status', 'Purchase complete! Your new games are in your library.');
    }

    private function itemsTotal($items): float
    {
        return (float) $items->sum(function ($item) {
            $price = $item->game->price;

            return $item->game->discount > 0
                ? $price * (1 - $item->game->discount / 100)
                : $price;
        });
    }
}
