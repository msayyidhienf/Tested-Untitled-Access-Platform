<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Game;
use App\Models\Library;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CollectionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:60',
        ]);

        Collection::firstOrCreate([
            'user_id' => Auth::id(),
            'name' => $data['name'],
        ]);

        return back();
    }

    public function destroy(Collection $collection): RedirectResponse
    {
        abort_unless($collection->user_id === Auth::id(), 403);

        $collection->delete();

        return back();
    }

    public function toggleGame(Collection $collection, Game $game): RedirectResponse
    {
        abort_unless($collection->user_id === Auth::id(), 403);

        $entry = Library::where('user_id', Auth::id())->where('game_id', $game->id)->first();

        if ($entry) {
            $collection->libraryEntries()->toggle($entry->id);
        }

        return back();
    }
}
