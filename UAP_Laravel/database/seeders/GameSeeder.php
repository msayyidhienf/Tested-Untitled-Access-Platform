<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\GameImage;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $games = json_decode(file_get_contents(__DIR__.'/data/games.json'), true);

        foreach ($games as $data) {
            Game::updateOrCreate(['title' => $data['title']], $data);
        }

        $images = json_decode(file_get_contents(__DIR__.'/data/game_images.json'), true);

        foreach ($images as $data) {
            $game = Game::where('title', $data['game_title'])->first();

            if ($game) {
                GameImage::firstOrCreate([
                    'game_id' => $game->id,
                    'filename' => $data['filename'],
                ], [
                    'sort_order' => $data['sort_order'],
                ]);
            }
        }
    }
}
