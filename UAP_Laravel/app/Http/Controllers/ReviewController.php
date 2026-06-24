<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Library;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user:id,username,avatar', 'game:id,title')
            ->orderByDesc('created_at')
            ->get();

        $userGames = Auth::check()
            ? Library::where('user_id', Auth::id())->with('game:id,title')->get()
            : collect();

        return Inertia::render('community/reviews', [
            'reviews' => $reviews,
            'userGames' => $userGames,
            'sidebar' => PostController::sidebarData(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'game_id' => 'required|exists:games,id',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string',
        ]);

        Review::create([
            'user_id' => Auth::id(),
            ...$data,
        ]);

        return redirect()->route('community.reviews');
    }
}
