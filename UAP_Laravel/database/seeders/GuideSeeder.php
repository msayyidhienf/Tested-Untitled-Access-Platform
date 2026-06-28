<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Guide;
use App\Models\User;
use Illuminate\Database\Seeder;

class GuideSeeder extends Seeder
{
    private array $titleTemplates = [
        'Beginner\'s Guide to {title}',
        '{title}: Tips I Wish I Knew Earlier',
        'How to Get Started in {title}',
        '{title} — Common Mistakes to Avoid',
        'Optimal Early-Game Strategy for {title}',
        '{title} Walkthrough Notes (No Spoilers)',
    ];

    private array $contentTemplates = [
        "Spent way too many hours figuring this out the hard way, so here's a quick rundown for anyone just starting {title}.\n\n1. Take your time with the early sections, the pacing rewards patience.\n2. Don't ignore side content, a lot of useful upgrades are tucked away there.\n3. Save often if the game allows it — better safe than sorry.\n\nHope this saves someone a few hours of trial and error.",
        "A few things that genuinely improved my experience with {title}:\n\n- Adjust the settings menu before diving in, defaults aren't always ideal.\n- Pay attention to tutorial hints, easy to miss but useful later.\n- Don't rush the opening hours, it sets up a lot for what's ahead.\n\nWill update this guide as I get further in.",
        "Wrote this after restarting {title} twice because I missed obvious stuff early on. Main takeaways:\n\n1. Plan your build/approach before committing resources.\n2. Explore a bit before progressing the main objective.\n3. Check back on areas you've already cleared, sometimes new things appear.\n\nFeel free to add your own tips in the replies.",
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

        foreach ($games as $game) {
            $guideCount = rand(1, 4);
            $authors = $users->random(min($guideCount, $users->count()));

            foreach ($authors as $author) {
                Guide::create([
                    'user_id' => $author->id,
                    'game_id' => $game->id,
                    'title' => str_replace('{title}', $game->title, $this->titleTemplates[array_rand($this->titleTemplates)]),
                    'content' => str_replace('{title}', $game->title, $this->contentTemplates[array_rand($this->contentTemplates)]),
                    'views' => rand(20, 1500),
                    'created_at' => now()->subDays(rand(0, 120)),
                ]);
            }
        }
    }
}
