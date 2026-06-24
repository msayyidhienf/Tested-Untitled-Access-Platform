<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $data = $request->validated();
        unset($data['avatar']);

        $user = $request->user();
        $user->fill($data);

        if ($request->hasFile('avatar')) {
            File::ensureDirectoryExists(public_path('assets/images/avatars'));

            $file = $request->file('avatar');
            $filename = 'avatar_'.$user->id.'_'.time().'.'.$file->getClientOriginalExtension();
            $file->move(public_path('assets/images/avatars'), $filename);

            if ($user->avatar && $user->avatar !== 'default.png' && File::exists(public_path('assets/images/avatars/'.$user->avatar))) {
                File::delete(public_path('assets/images/avatars/'.$user->avatar));
            }

            $user->avatar = $filename;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
