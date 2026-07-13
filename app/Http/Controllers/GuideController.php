<?php

namespace App\Http\Controllers;

use App\Models\Guide;
use Inertia\Inertia;

class GuideController extends Controller
{
    public function index()
    {
        $guides = Guide::with('user:id,username', 'game:id,title')
            ->orderByDesc('views')
            ->get();

        return Inertia::render('community/guides', [
            'guides' => $guides,
            'sidebar' => PostController::sidebarData(),
        ]);
    }
}
