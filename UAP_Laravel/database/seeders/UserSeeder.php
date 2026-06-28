<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    private const ADJECTIVES = [
        'shadow', 'lunar', 'pixel', 'night', 'crimson', 'frost', 'rogue', 'mystic', 'iron', 'void',
        'ember', 'silent', 'drift', 'astra', 'ghost', 'thunder', 'wraith', 'solar', 'nova', 'kael',
        'dusk', 'velvet', 'obsidian', 'spark', 'raven', 'crypt', 'azure', 'feral', 'glacier', 'phantom',
    ];

    private const NOUNS = [
        'blade', 'wolf', 'punk', 'owl', 'fox', 'byte', 'knight', 'arrow', 'heart', 'walker',
        'strike', 'storm', 'king', 'seeker', 'pilot', 'fall', 'mancer', 'flare', 'strider', 'runner',
        'viper', 'fang', 'hollow', 'shade', 'fury', 'reaper', 'hunter', 'warden', 'sentinel', 'rider',
    ];

    /**
     * Deterministically build a pool of gamer-tag style usernames
     * (e.g. "shadowblade", "lunarwolf") so other seeders can reuse the same list.
     */
    public static function usernames(int $count = 100): array
    {
        $names = [];

        foreach (self::ADJECTIVES as $adjective) {
            foreach (self::NOUNS as $noun) {
                $names[] = $adjective.$noun;

                if (count($names) >= $count) {
                    return $names;
                }
            }
        }

        return $names;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = ['Indonesia', 'Malaysia', 'Singapore', 'Philippines', 'Vietnam'];

        foreach (self::usernames() as $i => $username) {
            User::updateOrCreate(['username' => $username], [
                'email' => $username.'@uap.dev',
                'password' => Hash::make('password'),
                'bio' => null,
                'country' => $countries[$i % count($countries)],
                'role' => 'user',
                'created_at' => now()->subDays(rand(5, 200)),
            ]);
        }
    }
}
