<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', '');
        $search = $request->query('search', '');

        $transactions = WalletTransaction::with('user:id,username,email')
            ->when($type, fn ($q) => $q->where('type', $type))
            ->when($search, fn ($q) => $q->whereHas('user', function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            }))
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/wallets', [
            'transactions' => $transactions,
            'type' => $type,
            'search' => $search,
            'stats' => [
                'totalUsers' => User::where('ucash_balance', '>', 0)->count(),
                'totalBalance' => User::sum('ucash_balance'),
                'totalTopups' => WalletTransaction::where('type', 'topup')->sum('amount'),
            ],
        ]);
    }

    public function adjust(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'exists:users,username'],
            'amount' => ['required', 'numeric', 'not_in:0', 'min:-100000000', 'max:100000000'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $user = User::where('username', $data['username'])->firstOrFail();

        if ($data['amount'] < 0 && $user->ucash_balance < abs($data['amount'])) {
            return back()->withErrors(['amount' => 'User balance is lower than the debit amount.']);
        }

        DB::transaction(function () use ($user, $data) {
            $user->ucash_balance = $user->ucash_balance + $data['amount'];
            $user->save();

            WalletTransaction::create([
                'user_id' => $user->id,
                'type' => 'adjustment',
                'amount' => $data['amount'],
                'balance_after' => $user->ucash_balance,
                'description' => $data['reason'],
            ]);

            Notification::create([
                'user_id' => $user->id,
                'type' => 'adjustment',
                'title' => $data['amount'] >= 0 ? 'Balance Adjusted (Credit)' : 'Balance Adjusted (Debit)',
                'message' => $data['reason'],
                'link' => '/wallet',
            ]);
        });

        return redirect()->route('admin.wallets.index')->with('status', 'Balance adjusted for '.$user->username.'.');
    }
}
