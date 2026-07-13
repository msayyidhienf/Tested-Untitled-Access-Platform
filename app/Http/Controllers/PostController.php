<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostReply;
use App\Models\User;
use App\Models\Game;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category');

        $posts = Post::with(['user:id,username,avatar', 'replies.user:id,username,avatar'])
            ->when($category, fn ($q) => $q->where('category', $category))
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('community/feed', [
            'posts' => $posts,
            'category' => $category,
            'sidebar' => $this->sidebarData(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|in:General,Announcement,Game Discussion,Tech Support,Trading',
        ]);

        Post::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return back();
    }

    public function storeReply(Request $request, Post $post): RedirectResponse
    {
        $data = $request->validate([
            'content' => 'required|string',
        ]);

        PostReply::create([
            'post_id' => $post->id,
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return back();
    }

    public static function sidebarData(): array
    {
        $topPlayers = User::query()
            ->leftJoin('library', 'library.user_id', '=', 'users.id')
            ->select('users.username', 'users.avatar')
            ->selectRaw('COALESCE(SUM(library.hours_played), 0) as total_hours')
            ->groupBy('users.id', 'users.username', 'users.avatar')
            ->orderByDesc('total_hours')
            ->limit(6)
            ->get();

        $liveGames = Game::query()
            ->leftJoin('library', 'library.game_id', '=', 'games.id')
            ->select('games.title')
            ->selectRaw('COUNT(library.id) as player_count')
            ->groupBy('games.id', 'games.title')
            ->orderByDesc('player_count')
            ->limit(4)
            ->get();

        $trending = Game::query()
            ->join('reviews', 'reviews.game_id', '=', 'games.id')
            ->select('games.title')
            ->selectRaw('COUNT(reviews.id) as review_count')
            ->groupBy('games.id', 'games.title')
            ->orderByDesc('review_count')
            ->limit(4)
            ->get();

        return [
            'topPlayers' => $topPlayers,
            'liveGames' => $liveGames,
            'trending' => $trending,
            'stats' => [
                'totalPosts' => Post::count(),
                'totalMembers' => User::count(),
                'totalReviews' => Review::count(),
            ],
        ];
    }
}
