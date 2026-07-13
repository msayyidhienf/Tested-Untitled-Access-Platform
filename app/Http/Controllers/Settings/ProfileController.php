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
        unset($data['avatar'], $data['banner']);

        $user = $request->user();
        $user->fill($data);

        if ($request->hasFile('avatar')) {
            $user->avatar = $this->storeProfileImage($request, 'avatar', 'uploads/avatars/'.$user->id, $user->avatar);
        }

        if ($request->hasFile('banner')) {
            $user->banner = $this->storeProfileImage($request, 'banner', 'uploads/banners/'.$user->id, $user->banner);
        }

        $user->save();

        return to_route('profile.edit');
    }

    private function storeProfileImage(Request $request, string $field, string $relativeDir, ?string $oldFilename): string
    {
        $dir = public_path($relativeDir);
        File::ensureDirectoryExists($dir);

        $file = $request->file($field);
        $filename = $field.'_'.time().'.'.$file->getClientOriginalExtension();
        $file->move($dir, $filename);

        if ($oldFilename && File::exists($dir.'/'.$oldFilename)) {
            File::delete($dir.'/'.$oldFilename);
        }

        return $filename;
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
