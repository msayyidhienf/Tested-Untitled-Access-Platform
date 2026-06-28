<?php

namespace Database\Seeders;

use App\Models\SupportArticle;
use Illuminate\Database\Seeder;

class SupportArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $articles = json_decode(file_get_contents(__DIR__.'/data/support_articles.json'), true);

        foreach ($articles as $data) {
            SupportArticle::updateOrCreate(['title' => $data['title']], $data);
        }
    }
}
