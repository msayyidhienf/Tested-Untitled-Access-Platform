<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = json_decode(file_get_contents(__DIR__.'/data/achievements.json'), true);

        foreach ($achievements as $data) {
            Achievement::updateOrCreate(['name' => $data['name']], $data);
        }
    }
}
