<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function markRead(Notification $notification): RedirectResponse
    {
        if ($notification->user_id === Auth::id()) {
            $notification->update(['read_at' => now()]);
        }

        return back();
    }

    public function markAllRead(): RedirectResponse
    {
        Notification::where('user_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }
}
