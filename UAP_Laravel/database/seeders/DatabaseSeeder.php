<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            GameSeeder::class,
            AchievementSeeder::class,
            SupportArticleSeeder::class,
            UserSeeder::class,
            LibrarySeeder::class,
            PostSeeder::class,
            ReviewSeeder::class,
            GuideSeeder::class,
        ]);
    }
}
