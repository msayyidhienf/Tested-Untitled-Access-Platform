<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Friend;
use App\Models\Library;
use App\Models\User;
use App\Models\UserAchievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $userId = $user->id;

        $libraryStats = Library::where('user_id', $userId)->get();
        $unlockedAchievements = UserAchievement::where('user_id', $userId)
            ->with('achievement')
            ->orderByDesc('unlocked_at')
            ->get();

        $search = trim((string) $request->query('search', ''));
        $searchResults = $search
            ? User::where('username', 'like', "%{$search}%")->where('id', '!=', $userId)->limit(10)->get(['id', 'username', 'country'])
            : collect();

        return Inertia::render('profile/index', [
            'user' => $user,
            'stats' => [
                'totalGames' => $libraryStats->count(),
                'totalHours' => $libraryStats->sum('hours_played'),
                'totalFavorites' => $libraryStats->where('is_favorite', true)->count(),
                'totalAchievements' => $unlockedAchievements->count(),
                'friendCount' => Friend::where('user_id', $userId)->where('status', 'accepted')->count(),
            ],
            'recentlyPlayed' => Library::where('user_id', $userId)
                ->with('game')
                ->orderByDesc('hours_played')
                ->limit(3)
                ->get(),
            'achievements' => $unlockedAchievements,
            'allAchievements' => Achievement::all(),
            'friends' => Friend::where('user_id', $userId)
                ->where('status', 'accepted')
                ->with('friend:id,username,country')
                ->get(),
            'pendingRequests' => Friend::where('friend_id', $userId)
                ->where('status', 'pending')
                ->with('user:id,username,country')
                ->get(),
            'search' => $search,
            'searchResults' => $searchResults,
        ]);
    }
}
