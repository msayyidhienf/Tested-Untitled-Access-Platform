<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameImage;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $editGame = null;
        $editScreenshots = [];

        if ($request->query('edit')) {
            $editGame = Game::find($request->query('edit'));
            if ($editGame) {
                $editScreenshots = GameImage::where('game_id', $editGame->id)
                    ->orderBy('sort_order')
                    ->orderBy('id')
                    ->get();
            }
        }

        return Inertia::render('admin/games', [
            'games' => Game::orderByDesc('created_at')->get(),
            'editGame' => $editGame,
            'editScreenshots' => $editScreenshots,
            'saved' => $request->boolean('saved'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateGame($request);

        $game = Game::create($data);

        $game->update(['image' => $this->storeImage($request, $game->id)]);
        $this->storeScreenshots($request, $game->id);

        return redirect()->route('admin.games.index');
    }

    public function update(Request $request, Game $game): RedirectResponse
    {
        $data = $this->validateGame($request);
        $data['image'] = $this->storeImage($request, $game->id, $game->image);

        $game->update($data);

        $this->storeScreenshots($request, $game->id);

        return redirect()->route('admin.games.index', ['edit' => $game->id, 'saved' => 1]);
    }

    public function destroy(Game $game): RedirectResponse
    {
        File::deleteDirectory(public_path('uploads/games/'.$game->id));

        $game->delete();

        return redirect()->route('admin.games.index');
    }

    public function destroyScreenshot(Request $request): RedirectResponse
    {
        $image = GameImage::where('id', $request->input('image_id'))
            ->where('game_id', $request->input('game_id'))
            ->first();

        if ($image) {
            $path = public_path('uploads/games/'.$image->game_id.'/screenshots/'.$image->filename);
            if (File::exists($path)) {
                File::delete($path);
            }
            $image->delete();
        }

        return redirect()->route('admin.games.index', ['edit' => $request->input('game_id')]);
    }

    private function validateGame(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'genre' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'is_free' => 'nullable|boolean',
            'release_date' => 'nullable|date',
            'developer' => 'nullable|string|max:100',
            'publisher' => 'nullable|string|max:100',
            'req_os' => 'nullable|string|max:150',
            'req_processor' => 'nullable|string|max:200',
            'req_memory' => 'nullable|string|max:50',
            'req_graphics' => 'nullable|string|max:200',
            'req_storage' => 'nullable|string|max:50',
        ]) + ['is_free' => $request->boolean('is_free')];
    }

    private function storeImage(Request $request, int $gameId, ?string $oldImage = null): ?string
    {
        if (! $request->hasFile('image')) {
            return $oldImage;
        }

        $dir = public_path('uploads/games/'.$gameId);
        File::ensureDirectoryExists($dir);

        $file = $request->file('image');
        $filename = uniqid('cover_').'.'.$file->getClientOriginalExtension();
        $file->move($dir, $filename);

        if ($oldImage && File::exists($dir.'/'.$oldImage)) {
            File::delete($dir.'/'.$oldImage);
        }

        return $filename;
    }

    private function storeScreenshots(Request $request, int $gameId): void
    {
        if (! $request->hasFile('screenshots')) {
            return;
        }

        $dir = public_path('uploads/games/'.$gameId.'/screenshots');
        File::ensureDirectoryExists($dir);

        $maxOrder = GameImage::where('game_id', $gameId)->max('sort_order') ?? 0;

        foreach ($request->file('screenshots') as $i => $file) {
            $filename = uniqid('shot_').'.'.$file->getClientOriginalExtension();
            $file->move($dir, $filename);

            GameImage::create([
                'game_id' => $gameId,
                'filename' => $filename,
                'sort_order' => $maxOrder + $i + 1,
            ]);
        }
    }
}
