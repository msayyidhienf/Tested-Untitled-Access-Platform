<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Game;
use App\Models\Library;
use App\Services\AchievementService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LibraryController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();
        $tab = $request->query('tab', 'all');
        $collectionId = $request->query('collection');
        $search = trim((string) $request->query('q', ''));

        $query = Library::where('user_id', $userId)->with('game');

        if ($tab === 'installed') {
            $query->where('is_installed', true);
        } elseif ($tab === 'not-installed') {
            $query->where('is_installed', false);
        } elseif ($tab === 'favorites') {
            $query->where('is_favorite', true);
        } elseif ($tab === 'collection' && $collectionId) {
            $query->whereHas('collections', fn ($q) => $q->where('collections.id', $collectionId));
        } else {
            $tab = 'all';
            $collectionId = null;
        }

        $entries = $query->orderByDesc('purchased_at')->get();

        if ($search) {
            $entries = $entries->filter(function ($entry) use ($search) {
                $q = mb_strtolower($search);
                return str_contains(mb_strtolower($entry->game->title), $q)
                    || str_contains(mb_strtolower((string) $entry->game->genre), $q);
            })->values();
        }

        $allEntries = Library::where('user_id', $userId)->get();

        $collections = Collection::where('user_id', $userId)
            ->withCount('libraryEntries')
            ->orderBy('name')
            ->get();

        $entryCollectionIds = Library::where('user_id', $userId)
            ->with('collections:id')
            ->get()
            ->mapWithKeys(fn ($entry) => [$entry->game_id => $entry->collections->pluck('id')]);

        return Inertia::render('library/index', [
            'tab' => $tab,
            'collectionId' => $collectionId ? (int) $collectionId : null,
            'search' => $search,
            'entries' => $entries,
            'entryCollectionIds' => $entryCollectionIds,
            'collections' => $collections,
            'recentlyPlayed' => Library::where('user_id', $userId)
                ->whereNotNull('last_played_at')
                ->with('game')
                ->orderByDesc('last_played_at')
                ->limit(5)
                ->get(),
            'stats' => [
                'totalGames' => $allEntries->count(),
                'totalHours' => $allEntries->sum('hours_played'),
                'totalFavorites' => $allEntries->where('is_favorite', true)->count(),
                'totalInstalled' => $allEntries->where('is_installed', true)->count(),
            ],
        ]);
    }

    public function toggleFavorite(Game $game): RedirectResponse
    {
        $entry = Library::where('user_id', Auth::id())->where('game_id', $game->id)->first();

        if ($entry) {
            $entry->update(['is_favorite' => ! $entry->is_favorite]);
        }

        return back();
    }

    public function toggleInstalled(Game $game): RedirectResponse
    {
        $entry = Library::where('user_id', Auth::id())->where('game_id', $game->id)->first();

        if ($entry) {
            $entry->update(['is_installed' => ! $entry->is_installed]);
        }

        return back();
    }

    public function play(Game $game): RedirectResponse
    {
        $user = Auth::user();
        $entry = Library::where('user_id', $user->id)->where('game_id', $game->id)->first();

        abort_unless($entry && $entry->is_installed, 403, 'Install the game before you can play it.');

        $entry->update([
            'hours_played' => $entry->hours_played + rand(1, 4),
            'last_played_at' => now(),
        ]);

        AchievementService::check($user, 'hours_played');

        return back()->with('status', "Logged a play session for {$game->title}.");
    }
}
