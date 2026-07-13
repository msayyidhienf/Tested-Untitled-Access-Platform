<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Order;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'totalGames' => Game::count(),
                'freeGames' => Game::where('is_free', true)->count(),
                'onSaleGames' => Game::where('discount', '>', 0)->count(),
                'totalOrders' => Order::count(),
                'totalRevenue' => Order::where('status', 'paid')->sum('total'),
            ],
            'recentUsers' => User::orderByDesc('created_at')->limit(6)->get(['id', 'username', 'email', 'role', 'created_at']),
            'recentGames' => Game::orderByDesc('created_at')->limit(6)->get(['id', 'title', 'genre', 'price', 'is_free', 'discount', 'image']),
        ]);
    }
}
