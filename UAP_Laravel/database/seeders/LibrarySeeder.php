<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Library;
use App\Models\User;
use Illuminate\Database\Seeder;

class LibrarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('username', UserSeeder::usernames())->get();
        $games = Game::all();

        if ($users->isEmpty() || $games->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            $ownedCount = rand(4, 12);
            $ownedGames = $games->random(min($ownedCount, $games->count()));

            foreach ($ownedGames as $game) {
                Library::firstOrCreate([
                    'user_id' => $user->id,
                    'game_id' => $game->id,
                ], [
                    'hours_played' => rand(1, 250),
                    'is_installed' => (bool) rand(0, 1),
                    'is_favorite' => rand(0, 4) === 0,
                    'purchased_at' => now()->subDays(rand(1, 180)),
                ]);
            }
        }
    }
}
