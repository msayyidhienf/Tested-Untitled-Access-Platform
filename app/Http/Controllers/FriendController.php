<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    public function store(User $user): RedirectResponse
    {
        $viewer = Auth::user();

        if ($user->id !== $viewer->id) {
            Friend::firstOrCreate([
                'user_id' => $viewer->id,
                'friend_id' => $user->id,
            ]);

            Notification::create([
                'user_id' => $user->id,
                'type' => 'friend_request',
                'title' => 'New Friend Request',
                'message' => "{$viewer->username} sent you a friend request.",
                'link' => "/profile/{$viewer->id}",
            ]);
        }

        return back();
    }

    public function accept(User $user): RedirectResponse
    {
        $viewer = Auth::user();
        $userId = $viewer->id;

        Friend::where('user_id', $user->id)
            ->where('friend_id', $userId)
            ->update(['status' => 'accepted']);

        Friend::firstOrCreate([
            'user_id' => $userId,
            'friend_id' => $user->id,
        ], [
            'status' => 'accepted',
        ]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'friend_accept',
            'title' => 'Friend Request Accepted',
            'message' => "{$viewer->username} accepted your friend request.",
            'link' => "/profile/{$viewer->id}",
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
