<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $users = User::when($search, function ($query) use ($search) {
            $query->where('username', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        })->orderByDesc('created_at')->get();

        return Inertia::render('admin/users', [
            'users' => $users,
            'search' => $search,
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        if ($user->id !== Auth::id()) {
            $user->update(['role' => $request->input('role') === 'admin' ? 'admin' : 'user']);
        }

        return redirect()->route('admin.users.index');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id !== Auth::id()) {
            $user->delete();
        }

        return redirect()->route('admin.users.index');
    }
}
