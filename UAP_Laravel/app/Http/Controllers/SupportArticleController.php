<?php

namespace App\Http\Controllers;

use App\Models\SupportArticle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportArticleController extends Controller
{
    public function index()
    {
        return Inertia::render('support/help-home', [
            'popularArticles' => SupportArticle::orderByDesc('views')->limit(5)->get(),
        ]);
    }

    public function byCategory(Request $request)
    {
        $category = $request->query('cat', '');

        return Inertia::render('support/articles', [
            'category' => $category,
            'articles' => $category ? SupportArticle::where('category', $category)->orderByDesc('views')->get() : [],
        ]);
    }

    public function show(SupportArticle $article)
    {
        $article->increment('views');

        return Inertia::render('support/article', [
            'article' => $article,
        ]);
    }
}
