<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Library;
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
        $search = trim((string) $request->query('q', ''));

        $query = Library::where('user_id', $userId)->with('game');

        if ($tab === 'installed') {
            $query->where('is_installed', true);
        } elseif ($tab === 'not-installed') {
            $query->where('is_installed', false);
        } elseif ($tab === 'favorites') {
            $query->where('is_favorite', true);
        } else {
            $tab = 'all';
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

        return Inertia::render('library/index', [
            'tab' => $tab,
            'search' => $search,
            'entries' => $entries,
            'recentlyPlayed' => Library::where('user_id', $userId)
                ->with('game')
                ->orderByDesc('hours_played')
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
}
