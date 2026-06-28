<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportArticle;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $editId = $request->query('edit');

        return Inertia::render('admin/articles', [
            'articles' => SupportArticle::orderByDesc('created_at')->get(),
            'editArticle' => $editId ? SupportArticle::find($editId) : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        SupportArticle::create($this->validateArticle($request));

        return redirect()->route('admin.articles.index');
    }

    public function update(Request $request, SupportArticle $article): RedirectResponse
    {
        $article->update($this->validateArticle($request));

        return redirect()->route('admin.articles.index');
    }

    public function destroy(SupportArticle $article): RedirectResponse
    {
        $article->delete();

        return redirect()->route('admin.articles.index');
    }

    private function validateArticle(Request $request): array
    {
        return $request->validate([
            'category' => 'required|string|max:80',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
    }
}
