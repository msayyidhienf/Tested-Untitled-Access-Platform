<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Game;
use App\Models\Library;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $items = Cart::where('user_id', Auth::id())->with('game')->get();

        $total = $items->sum(function ($item) {
            $price = $item->game->price;
            return $item->game->discount > 0
                ? $price * (1 - $item->game->discount / 100)
                : $price;
        });

        return Inertia::render('cart/index', [
            'items' => $items,
            'total' => $total,
        ]);
    }

    public function store(Game $game): RedirectResponse
    {
        Cart::firstOrCreate([
            'user_id' => Auth::id(),
            'game_id' => $game->id,
        ], [
            'added_at' => now(),
        ]);

        return back();
    }

    public function destroy(Game $game): RedirectResponse
    {
        Cart::where('user_id', Auth::id())->where('game_id', $game->id)->delete();

        return redirect()->route('cart.index');
    }

    public function checkout(): RedirectResponse
    {
        $userId = Auth::id();
        $items = Cart::where('user_id', $userId)->with('game')->get();

        if ($items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        DB::transaction(function () use ($userId, $items) {
            $total = $items->sum(function ($item) {
                $price = $item->game->price;
                return $item->game->discount > 0
                    ? $price * (1 - $item->game->discount / 100)
                    : $price;
            });

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

            Cart::where('user_id', $userId)->delete();
        });

        return redirect()->route('library.index');
    }
}
