<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Library;
use App\Models\Notification;
use App\Models\Order;
use App\Models\WalletTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', '');

        $orders = Order::with(['user:id,username,email', 'items.game:id,title'])
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('admin/orders', [
            'orders' => $orders,
            'status' => $status,
            'stats' => [
                'totalOrders' => Order::count(),
                'totalRevenue' => Order::where('status', 'paid')->sum('total'),
                'cancelledOrders' => Order::where('status', 'cancelled')->count(),
            ],
        ]);
    }

    public function refund(Order $order): RedirectResponse
    {
        if ($order->status === 'paid') {
            DB::transaction(function () use ($order) {
                $user = $order->user;
                $user->ucash_balance = $user->ucash_balance + $order->total;
                $user->save();

                WalletTransaction::create([
                    'user_id' => $user->id,
                    'type' => 'refund',
                    'amount' => $order->total,
                    'balance_after' => $user->ucash_balance,
                    'description' => 'Refund for Order #'.$order->id,
                    'order_id' => $order->id,
                ]);

                $gameIds = $order->items()->pluck('game_id');

                Library::where('user_id', $user->id)
                    ->whereIn('game_id', $gameIds)
                    ->delete();

                Notification::create([
                    'user_id' => $user->id,
                    'type' => 'refund',
                    'title' => 'Order Refunded',
                    'message' => 'Your order #'.$order->id.' was refunded to your Ucash balance and removed from your library.',
                    'link' => '/wallet',
                ]);

                $order->update(['status' => 'cancelled']);
            });
        }

        return redirect()->route('admin.orders.index');
    }
}
