<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    private array $positive = [
        "Absolutely worth every hour I've put in. {title} nails the core gameplay loop and keeps surprising me even after dozens of hours.",
        "One of the better purchases I've made on here. {title} has great pacing and the replay value is real.",
        'Did not expect to get this hooked. Picked up {title} on a whim and ended up canceling my weekend plans.',
        "Solid from start to finish. {title} respects your time and doesn't pad itself with filler content.",
        'Genuinely impressed by the polish on {title}. Performance has been smooth and the content keeps coming.',
    ];

    private array $mixed = [
        '{title} is good but not without its rough edges. Some mechanics feel undercooked, though the core experience holds up.',
        'Enjoyed my time with {title} overall, just wish there was more variety later on. Still recommend it.',
        'Decent game. {title} has a strong first half but loses some steam toward the end.',
    ];

    private array $negative = [
        "Wanted to like {title} more than I did. Technical issues kept pulling me out of the experience.",
        '{title} has potential but feels unfinished in its current state. Might revisit after a few patches.',
    ];

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
            $reviewCount = rand(3, 8);
            $gamesToReview = $games->random(min($reviewCount, $games->count()));

            foreach ($gamesToReview as $game) {
                $rating = $this->weightedRating();
                $pool = match (true) {
                    $rating >= 4 => $this->positive,
                    $rating === 3 => $this->mixed,
                    default => $this->negative,
                };

                Review::firstOrCreate([
                    'user_id' => $user->id,
                    'game_id' => $game->id,
                ], [
                    'rating' => $rating,
                    'content' => str_replace('{title}', $game->title, $pool[array_rand($pool)]),
                    'helpful_count' => rand(0, 40),
                    'created_at' => now()->subDays(rand(0, 90)),
                ]);
            }
        }
    }

    private function weightedRating(): int
    {
        // Skewed toward positive ratings, like a real community.
        $weights = [5, 5, 5, 4, 4, 4, 3, 3, 2, 1];

        return $weights[array_rand($weights)];
    }
}
