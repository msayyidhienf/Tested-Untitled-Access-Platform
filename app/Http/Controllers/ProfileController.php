<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Friend;
use App\Models\Library;
use App\Models\Review;
use App\Models\User;
use App\Models\UserAchievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $viewer = Auth::user();

        return $this->render($request, $viewer, $viewer);
    }

    public function show(Request $request, User $user)
    {
        $viewer = Auth::user();

        if ($user->id === $viewer->id) {
            return redirect()->route('profile.index');
        }

        return $this->render($request, $user, $viewer);
    }

    private function render(Request $request, User $user, User $viewer)
    {
        $userId = $user->id;
        $isOwnProfile = $userId === $viewer->id;

        $libraryStats = Library::where('user_id', $userId)->get();
        $unlockedAchievements = UserAchievement::where('user_id', $userId)
            ->with('achievement')
            ->orderByDesc('unlocked_at')
            ->get();

        $search = $isOwnProfile ? trim((string) $request->query('search', '')) : '';
        $searchResults = $search
            ? User::where('username', 'like', "%{$search}%")->where('id', '!=', $userId)->limit(10)->get(['id', 'username', 'country', 'avatar'])
            : collect();

        $friendship = null;
        if (! $isOwnProfile) {
            $outgoing = Friend::where('user_id', $viewer->id)->where('friend_id', $userId)->first();
            $incoming = Friend::where('user_id', $userId)->where('friend_id', $viewer->id)->first();

            if ($outgoing?->status === 'accepted' || $incoming?->status === 'accepted') {
                $friendship = 'accepted';
            } elseif ($outgoing) {
                $friendship = 'pending_sent';
            } elseif ($incoming) {
                $friendship = 'pending_received';
            } else {
                $friendship = 'none';
            }
        }

        return Inertia::render('profile/index', [
            'user' => $user,
            'isOwnProfile' => $isOwnProfile,
            'friendship' => $friendship,
            'stats' => [
                'totalGames' => $libraryStats->count(),
                'totalHours' => $libraryStats->sum('hours_played'),
                'totalFavorites' => $libraryStats->where('is_favorite', true)->count(),
                'totalAchievements' => $unlockedAchievements->count(),
                'friendCount' => Friend::where('user_id', $userId)->where('status', 'accepted')->count(),
                'totalReviews' => Review::where('user_id', $userId)->count(),
            ],
            'recentlyPlayed' => Library::where('user_id', $userId)
                ->with('game')
                ->orderByDesc('hours_played')
                ->limit(3)
                ->get(),
            'showcaseGames' => Library::where('user_id', $userId)
                ->where('is_favorite', true)
                ->with('game.images')
                ->orderByDesc('hours_played')
                ->limit(6)
                ->get(),
            'showcaseCandidates' => $isOwnProfile
                ? Library::where('user_id', $userId)
                    ->where('is_favorite', false)
                    ->with('game:id,title,image')
                    ->orderByDesc('hours_played')
                    ->get(['id', 'game_id', 'user_id', 'hours_played'])
                : collect(),
            'achievements' => $unlockedAchievements,
            'allAchievements' => Achievement::all(),
            'friends' => Friend::where('user_id', $userId)
                ->where('status', 'accepted')
                ->with('friend:id,username,country,avatar')
                ->get(),
            'pendingRequests' => $isOwnProfile
                ? Friend::where('friend_id', $userId)
                    ->where('status', 'pending')
                    ->with('user:id,username,country,avatar')
                    ->get()
                : collect(),
            'search' => $search,
            'searchResults' => $searchResults,
        ]);
    }
}
