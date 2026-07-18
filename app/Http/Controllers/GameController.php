<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Cart;
use App\Models\Library;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $genre = $request->query('genre');
        $filter = $request->query('filter');
        $q = trim((string) $request->query('q', ''));

        if ($q !== '') {
            return Inertia::render('store/index', [
                'mode' => 'filtered',
                'filterTitle' => 'Search results for "'.$q.'"',
                'games' => Game::where('title', 'like', "%{$q}%")->orderByDesc('created_at')->get(),
                ...$this->ownershipProps(),
            ]);
        }

        if ($genre) {
            return Inertia::render('store/index', [
                'mode' => 'filtered',
                'filterTitle' => $genre,
                'games' => Game::where('genre', $genre)->orderByDesc('created_at')->get(),
                ...$this->ownershipProps(),
            ]);
        }

        if ($filter === 'new') {
            return Inertia::render('store/index', [
                'mode' => 'filtered',
                'filterTitle' => 'New Releases',
                'games' => Game::orderByDesc('release_date')->limit(8)->get(),
                ...$this->ownershipProps(),
            ]);
        }

        if ($filter === 'sale') {
            return Inertia::render('store/index', [
                'mode' => 'filtered',
                'filterTitle' => 'On Sale',
                'games' => Game::where('discount', '>', 0)->orderByDesc('discount')->get(),
                ...$this->ownershipProps(),
            ]);
        }

        if ($filter === 'free') {
            return Inertia::render('store/index', [
                'mode' => 'filtered',
                'filterTitle' => 'Free to Play',
                'games' => Game::where('is_free', true)->get(),
                ...$this->ownershipProps(),
            ]);
        }

        $heroGames = Game::where('is_hero', true)->orderBy('hero_order')->orderByDesc('created_at')->limit(5)->get();

        return Inertia::render('store/index', [
            'mode' => 'default',
            'heroGames' => $heroGames,
            'featuredGames' => Game::where('is_free', false)->orderByDesc('created_at')->limit(8)->get(),
            'newReleases' => Game::orderByDesc('release_date')->limit(8)->get(),
            'onSaleGames' => Game::where('discount', '>', 0)->orderByDesc('discount')->get(),
            'freeGames' => Game::where('is_free', true)->get(),
            ...$this->ownershipProps(),
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if ($q === '') {
            return response()->json(['results' => []]);
        }

        $games = Game::where('title', 'like', "%{$q}%")
            ->orderByDesc('created_at')
            ->limit(8)
            ->get(['id', 'title', 'genre', 'price', 'discount', 'is_free', 'image']);

        return response()->json(['results' => $games]);
    }

    public function show(Game $game)
    {
        $userId = auth()->id();

        return Inertia::render('store/show', [
            'game' => $game,
            'images' => $game->images,
            'reviews' => $game->reviews()->with('user:id,username,avatar')->latest('created_at')->get(),
            'inCart' => $userId ? Cart::where('user_id', $userId)->where('game_id', $game->id)->exists() : false,
            'inLibrary' => $userId ? Library::where('user_id', $userId)->where('game_id', $game->id)->exists() : false,
        ]);
    }

    /**
     * Which games the current user already owns or already has in their cart,
     * so store grids can render "Add to Cart" / "In Cart" / "Owned" correctly.
     */
    private function ownershipProps(): array
    {
        $userId = Auth::id();

        return [
            'ownedGameIds' => $userId ? Library::where('user_id', $userId)->pluck('game_id') : [],
            'cartGameIds' => $userId ? Cart::where('user_id', $userId)->pluck('game_id') : [],
        ];
    }
}
