<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        $editId = $request->query('edit');

        return Inertia::render('admin/achievements', [
            'achievements' => Achievement::withCount('users')->orderBy('name')->get(),
            'editAchievement' => $editId ? Achievement::find($editId) : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Achievement::create($this->validateAchievement($request));

        return redirect()->route('admin.achievements.index');
    }

    public function update(Request $request, Achievement $achievement): RedirectResponse
    {
        $achievement->update($this->validateAchievement($request));

        return redirect()->route('admin.achievements.index');
    }

    public function destroy(Achievement $achievement): RedirectResponse
    {
        $achievement->delete();

        return redirect()->route('admin.achievements.index');
    }

    private function validateAchievement(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string|max:255',
            'rarity' => 'required|in:Common,Rare,Epic,Legendary',
            'type' => 'nullable|in:games_owned,hours_played,reviews_written,posts_written,guides_written,friends_count,sale_purchase,free_game_added,early_adopter',
            'threshold' => 'nullable|required_with:type|integer|min:1',
        ]);
    }
}
