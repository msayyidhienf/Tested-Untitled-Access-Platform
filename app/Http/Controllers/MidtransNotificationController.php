<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\TopupOrder;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Midtrans\Config as MidtransConfig;
use Midtrans\Notification as MidtransNotification;

class MidtransNotificationController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        MidtransConfig::$serverKey = config('midtrans.server_key');
        MidtransConfig::$isProduction = (bool) config('midtrans.is_production');
        MidtransConfig::$isSanitized = config('midtrans.is_sanitized');
        MidtransConfig::$is3ds = config('midtrans.is_3ds');

        try {
            $notification = new MidtransNotification;
        } catch (\Throwable $e) {
            Log::warning('Midtrans notification could not be parsed (likely a connectivity test)', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Notification received.']);
        }

        $orderId = $notification->order_id;
        $transactionStatus = $notification->transaction_status;
        $fraudStatus = $notification->fraud_status;
        $paymentType = $notification->payment_type;

        $topupOrder = TopupOrder::where('midtrans_order_id', $orderId)->first();

        if (! $topupOrder) {
            Log::warning('Midtrans notification for unknown order', ['order_id' => $orderId]);

            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($topupOrder->status === 'settlement') {
            return response()->json(['message' => 'Already processed']);
        }

        if (in_array($transactionStatus, ['capture', 'settlement'], true) && $fraudStatus !== 'deny') {
            DB::transaction(function () use ($topupOrder, $paymentType) {
                $user = $topupOrder->user()->lockForUpdate()->first();
                $user->ucash_balance = $user->ucash_balance + $topupOrder->amount;
                $user->save();

                WalletTransaction::create([
                    'user_id' => $user->id,
                    'type' => 'topup',
                    'amount' => $topupOrder->amount,
                    'balance_after' => $user->ucash_balance,
                    'description' => 'Top Up Ucash via '.str_replace('_', ' ', $paymentType ?? 'Midtrans'),
                    'topup_order_id' => $topupOrder->id,
                ]);

                $topupOrder->update([
                    'status' => 'settlement',
                    'payment_type' => $paymentType,
                    'paid_at' => now(),
                ]);

                Notification::create([
                    'user_id' => $user->id,
                    'type' => 'topup',
                    'title' => 'Top Up Successful',
                    'message' => 'You topped up Rp '.number_format($topupOrder->amount, 0, ',', '.').' Ucash.',
                    'link' => '/wallet',
                ]);
            });
        } elseif (in_array($transactionStatus, ['expire', 'cancel'], true)) {
            $topupOrder->update(['status' => $transactionStatus === 'expire' ? 'expired' : 'failed']);
        } elseif ($transactionStatus === 'deny') {
            $topupOrder->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'OK']);
    }
}
