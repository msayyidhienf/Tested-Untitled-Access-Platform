<?php

namespace App\Http\Controllers;

use App\Models\TopupOrder;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Midtrans\Config as MidtransConfig;
use Midtrans\Snap;

class WalletController extends Controller
{
    public const PRESETS = [12000, 60000, 120000, 300000, 600000, 1200000];

    public const TYPES = ['topup', 'purchase', 'refund', 'adjustment'];

    public function index(Request $request)
    {
        $user = Auth::user();
        $type = $request->query('type', '');

        return Inertia::render('wallet/index', [
            'balance' => $user->ucash_balance,
            'presets' => self::PRESETS,
            'type' => $type,
            'transactions' => WalletTransaction::where('user_id', $user->id)
                ->when(in_array($type, self::TYPES, true), fn ($q) => $q->where('type', $type))
                ->orderByDesc('created_at')
                ->paginate(15)
                ->withQueryString(),
        ]);
    }

    public function topUp(Request $request): JsonResponse
    {
        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000', 'max:10000000'],
        ]);

        $user = Auth::user();

        MidtransConfig::$serverKey = config('midtrans.server_key');
        MidtransConfig::$isProduction = (bool) config('midtrans.is_production');
        MidtransConfig::$isSanitized = config('midtrans.is_sanitized');
        MidtransConfig::$is3ds = config('midtrans.is_3ds');

        $orderId = 'UCTOPUP-'.$user->id.'-'.now()->format('YmdHis').'-'.strtoupper(Str::random(4));

        $topupOrder = TopupOrder::create([
            'user_id' => $user->id,
            'midtrans_order_id' => $orderId,
            'amount' => $data['amount'],
            'status' => 'pending',
        ]);

        $snapToken = Snap::getSnapToken([
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $data['amount'],
            ],
            'customer_details' => [
                'first_name' => $user->username,
                'email' => $user->email,
            ],
            'item_details' => [[
                'id' => 'ucash-topup',
                'price' => (int) $data['amount'],
                'quantity' => 1,
                'name' => 'Ucash Top Up',
            ]],
        ]);

        $topupOrder->update(['snap_token' => $snapToken]);

        return response()->json(['snap_token' => $snapToken]);
    }
}
