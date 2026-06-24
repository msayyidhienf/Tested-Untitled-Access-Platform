<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    public function store(User $user): RedirectResponse
    {
        $userId = Auth::id();

        if ($user->id !== $userId) {
            Friend::firstOrCreate([
                'user_id' => $userId,
                'friend_id' => $user->id,
            ]);
        }

        return back();
    }

    public function accept(User $user): RedirectResponse
    {
        $userId = Auth::id();

        Friend::where('user_id', $user->id)
            ->where('friend_id', $userId)
            ->update(['status' => 'accepted']);

        Friend::firstOrCreate([
            'user_id' => $userId,
            'friend_id' => $user->id,
        ], [
            'status' => 'accepted',
        ]);

        return back();
    }

    public function decline(User $user): RedirectResponse
    {
        Friend::where('user_id', $user->id)
            ->where('friend_id', Auth::id())
            ->delete();

        return back();
    }
}
