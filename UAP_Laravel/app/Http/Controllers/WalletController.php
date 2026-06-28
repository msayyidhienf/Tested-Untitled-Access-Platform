<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WalletController extends Controller
{
    public const PRESETS = [12000, 60000, 120000, 300000, 600000, 1200000];

    public function index()
    {
        $user = Auth::user();

        return Inertia::render('wallet/index', [
            'balance' => $user->ucash_balance,
            'presets' => self::PRESETS,
            'transactions' => WalletTransaction::where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->limit(50)
                ->get(),
        ]);
    }

    public function topUp(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000', 'max:10000000'],
        ]);

        $user = Auth::user();

        DB::transaction(function () use ($user, $data) {
            $user->ucash_balance = $user->ucash_balance + $data['amount'];
            $user->save();

            WalletTransaction::create([
                'user_id' => $user->id,
                'type' => 'topup',
                'amount' => $data['amount'],
                'balance_after' => $user->ucash_balance,
                'description' => 'Top Up Ucash',
            ]);

            Notification::create([
                'user_id' => $user->id,
                'type' => 'topup',
                'title' => 'Top Up Successful',
                'message' => 'You topped up Rp '.number_format($data['amount'], 0, ',', '.').' Ucash.',
                'link' => '/wallet',
            ]);
        });

        return redirect()->route('wallet.index')->with('status', 'Top up successful!');
    }
}
