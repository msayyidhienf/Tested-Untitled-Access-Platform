<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Post;
use App\Models\PostReply;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    private array $templates = [
        'General' => [
            ['title' => 'What are you all playing this weekend?', 'content' => "Looking for something new to sink hours into. What's everyone grinding right now?"],
            ['title' => 'UAP library is getting huge', 'content' => "Just checked my library count and honestly impressed how fast it's growing. Anyone else stacking up unplayed games?"],
            ['title' => 'Best setup for long gaming sessions?', 'content' => 'Chair, monitor, snacks — drop your setup tips below, my back is not doing great lately lol.'],
            ['title' => 'Late night gaming squad?', 'content' => 'Anyone around 11PM+ WIB looking for co-op partners? Tired of solo queuing everything.'],
        ],
        'Announcement' => [
            ['title' => 'Weekend sale is live!', 'content' => 'Just noticed several titles are discounted right now on the Store page. Grab them before it ends.'],
            ['title' => 'New achievements rolled out', 'content' => 'Looks like a batch of new achievements got added. Check your Profile tab, some of you probably unlocked a few already.'],
            ['title' => 'Heads up: maintenance window', 'content' => 'Saw a notice about scheduled maintenance. Save your progress and expect brief downtime.'],
        ],
        'Game Discussion' => [
            ['title' => 'Anyone else stuck on the final boss?', 'content' => 'Been trying for 2 hours straight, no shame admitting defeat at this point. Any tips appreciated.'],
            ['title' => 'Underrated mechanic nobody talks about', 'content' => 'The crafting system in this game is way deeper than people give it credit for. Sleeper feature honestly.'],
            ['title' => 'Story vs gameplay — which matters more to you?', 'content' => 'Curious what this community values more when picking a new game to start.'],
            ['title' => 'First impressions after 10 hours', 'content' => 'Mixed feelings so far. Combat is solid but pacing feels off in the early chapters. Anyone else felt this?'],
        ],
        'Tech Support' => [
            ['title' => 'Game keeps crashing on launch', 'content' => 'Tried reinstalling twice already, still crashes right after the splash screen. Any fix?'],
            ['title' => 'Low FPS despite decent specs', 'content' => 'Getting weirdly low frame rate even on lowest settings. Driver issue maybe?'],
            ['title' => 'Controller not detected', 'content' => "Wired controller works fine in other games but this one just won't recognize it. Anyone solved this?"],
        ],
        'Trading' => [
            ['title' => 'Looking to trade game keys', 'content' => 'Got a couple of duplicate keys from a bundle, open to trading for anything on my wishlist.'],
            ['title' => 'Anyone selling old library access?', 'content' => 'Just curious if account/library trading is even a thing here, asking for a friend.'],
        ],
    ];

    private array $gameTemplates = [
        'General' => [
            ['title' => 'Just added {title} to my library', 'content' => "Picked up {title} during the sale, only had time for the intro so far but liking what I've seen."],
            ['title' => 'Anyone still playing {title}?', 'content' => "Got back into {title} after a long break, surprised how many people are still active in it."],
        ],
        'Game Discussion' => [
            ['title' => '{title} is better than people give it credit for', 'content' => "Don't see enough people talking about {title} here. The depth in the systems is way more than I expected going in."],
            ['title' => 'Tips for someone starting {title}?', 'content' => 'About to start {title} for the first time, anything I should know before diving in?'],
            ['title' => 'Favorite moment so far in {title}', 'content' => "Had a genuinely great moment playing {title} last night, this game keeps delivering."],
        ],
        'Tech Support' => [
            ['title' => '{title} stuttering on my rig', 'content' => 'Getting random stutters in {title} even though my specs should handle it fine. Anyone else?'],
        ],
        'Trading' => [
            ['title' => 'Trading my {title} key', 'content' => 'Ended up with a spare key for {title} from a bundle, open to offers on anything in my wishlist.'],
        ],
    ];

    private array $replyTemplates = [
        'Same boat here, following this thread.',
        'Try lowering your graphics settings first, fixed it for me.',
        'This happened to me too, ended up just waiting for a patch.',
        'Honestly underrated take, agree 100%.',
        'Have you tried verifying the game files from your Library page?',
        "lol same energy, this game lives in my head rent free",
        'Following, also stuck on this part',
        "Pretty sure that's a known issue, saw other people mention it too",
        'Worked for me after a clean reinstall, worth a shot',
        'Honestly this thread saved me, thanks for posting',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('username', UserSeeder::usernames())->get();
        $games = Game::all();

        if ($users->isEmpty()) {
            return;
        }

        // Cycle through a shuffled pool of authors so activity spreads across
        // as many of the seeded users as possible, instead of always picking
        // from the same handful via random().
        $authorPool = $users->shuffle()->values();
        $authorCursor = 0;
        $nextAuthor = function () use ($authorPool, &$authorCursor) {
            $author = $authorPool[$authorCursor % $authorPool->count()];
            $authorCursor++;

            return $author;
        };

        foreach ($this->templates as $category => $posts) {
            foreach ($posts as $template) {
                $this->createPost($template['title'], $template['content'], $category, $nextAuthor(), $users);
            }
        }

        // Generate extra game-referencing posts so more of the user pool
        // gets represented and the feed has more volume overall.
        if ($games->isNotEmpty()) {
            foreach ($this->gameTemplates as $category => $posts) {
                foreach ($posts as $template) {
                    foreach ($games->random(min(6, $games->count())) as $game) {
                        $this->createPost(
                            str_replace('{title}', $game->title, $template['title']),
                            str_replace('{title}', $game->title, $template['content']),
                            $category,
                            $nextAuthor(),
                            $users,
                        );
                    }
                }
            }
        }
    }

    private function createPost(string $title, string $content, string $category, User $author, \Illuminate\Support\Collection $users): void
    {
        $post = Post::create([
            'user_id' => $author->id,
            'title' => $title,
            'content' => $content,
            'category' => $category,
            'created_at' => now()->subDays(rand(0, 60))->subHours(rand(0, 23)),
        ]);

        $replyCount = rand(0, 8);
        for ($i = 0; $i < $replyCount; $i++) {
            PostReply::create([
                'post_id' => $post->id,
                'user_id' => $users->random()->id,
                'content' => $this->replyTemplates[array_rand($this->replyTemplates)],
                'created_at' => $post->created_at->copy()->addHours(rand(1, 48)),
            ]);
        }
    }
}
