<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class WalletTransaction extends Model
{
    /**
     * Tabel wallet_transactions tidak punya kolom updated_at.
     */
    public $timestamps = false;

    protected $fillable = [
        'reference_no',
        'user_id',
        'type',
        'amount',
        'balance_after',
        'description',
        'order_id',
        'topup_order_id',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $transaction) {
            if (! $transaction->reference_no) {
                $transaction->reference_no = 'UC-'.now()->format('ymd').'-'.strtoupper(Str::random(6));
            }
        });
    }

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
            'created_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function topupOrder()
    {
        return $this->belongsTo(TopupOrder::class);
    }
}
