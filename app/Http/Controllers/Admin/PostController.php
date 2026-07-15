<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $category = $request->query('category', '');

        $posts = Post::with('user:id,username,email')
            ->withCount('replies')
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('username', 'like', "%{$search}%"));
            }))
            ->when($category, fn ($q) => $q->where('category', $category))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/posts', [
            'posts' => $posts,
            'search' => $search,
            'category' => $category,
        ]);
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('admin.posts.index');
    }
}
