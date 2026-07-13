<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\Notification;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'cartCount' => Auth::check() ? Cart::where('user_id', Auth::id())->count() : 0,
            'ucashBalance' => Auth::check() ? $request->user()->ucash_balance : null,
            'midtrans' => [
                'clientKey' => config('midtrans.client_key'),
                'isProduction' => (bool) config('midtrans.is_production'),
            ],
            'notifications' => Auth::check()
                ? Notification::where('user_id', Auth::id())->orderByDesc('created_at')->limit(15)->get()
                : [],
            'unreadNotificationCount' => Auth::check()
                ? Notification::where('user_id', Auth::id())->whereNull('read_at')->count()
                : 0,
            'flash' => [
                'status' => $request->session()->get('status'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }
}
